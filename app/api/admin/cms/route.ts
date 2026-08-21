import { cookies } from "next/headers"
import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET() {
  const authenticated = (await cookies()).has("olinethra_admin_session")
  return proxyJson(await backendFetch(authenticated ? "/admin/cms" : "/cms"))
}

export async function POST(request: Request) {
  return proxyJson(await backendFetch("/admin/cms", { method: "POST", headers: { "content-type": "application/json" }, body: await request.text() }))
}
