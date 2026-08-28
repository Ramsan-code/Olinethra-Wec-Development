import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { backendFetch, forwardSetCookies } from "@/lib/backend-api"
import { decodeFlow, GOOGLE_FLOW_COOKIE, googleRedirectUri, safeEqual } from "@/lib/google-oauth"

export const runtime = "nodejs"

function loginRedirect(request: Request, error: string) {
  const response = NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(error)}`, request.url))
  response.cookies.delete({ name: GOOGLE_FLOW_COOKIE, path: "/api/admin/auth/google/callback" })
  return response
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  if (url.searchParams.get("error") === "access_denied") return loginRedirect(request, "cancelled")
  if (url.searchParams.has("error")) return loginRedirect(request, "google_error")

  const flow = decodeFlow((await cookies()).get(GOOGLE_FLOW_COOKIE)?.value)
  const state = url.searchParams.get("state")
  const code = url.searchParams.get("code")
  if (!flow || !state || !code || !safeEqual(flow.state, state)) return loginRedirect(request, "invalid_state")

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return loginRedirect(request, "not_configured")

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: googleRedirectUri(),
        grant_type: "authorization_code",
        code_verifier: flow.verifier,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    })
    if (!tokenResponse.ok) return loginRedirect(request, "token_exchange")
    const tokens = await tokenResponse.json() as { id_token?: string }
    if (!tokens.id_token) return loginRedirect(request, "token_exchange")

    const backendResponse = await backendFetch("/auth/google", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken: tokens.id_token, nonce: flow.nonce }),
    })
    if (!backendResponse.ok) {
      const body = await backendResponse.json().catch(() => null) as { error?: { code?: string } } | null
      return loginRedirect(request, body?.error?.code === "GOOGLE_ADMIN_UNAUTHORIZED" ? "unauthorized" : "verification")
    }

    const response = NextResponse.redirect(new URL(flow.next, request.url))
    forwardSetCookies(backendResponse, response)
    response.cookies.delete({ name: GOOGLE_FLOW_COOKIE, path: "/api/admin/auth/google/callback" })
    return response
  } catch {
    return loginRedirect(request, "unavailable")
  }
}
