import { NextResponse } from "next/server"
import {
  GOOGLE_FLOW_COOKIE,
  GOOGLE_CALLBACK_PATH,
  encodeFlow,
  googleRedirectUri,
  randomBase64Url,
  safeAdminPath,
  sha256Base64Url,
} from "@/lib/google-oauth"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(new URL("/admin/login?error=not_configured", request.url))
  }

  const requestUrl = new URL(request.url)
  const state = randomBase64Url()
  const nonce = randomBase64Url()
  const verifier = randomBase64Url(64)
  const next = safeAdminPath(requestUrl.searchParams.get("next"))
  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  googleUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: sha256Base64Url(verifier),
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString()

  const response = NextResponse.redirect(googleUrl)
  response.cookies.set(GOOGLE_FLOW_COOKIE, encodeFlow({ state, nonce, verifier, next }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: GOOGLE_CALLBACK_PATH,
    maxAge: 10 * 60,
  })
  return response
}
