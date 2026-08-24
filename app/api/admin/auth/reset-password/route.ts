import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function POST(request: Request) {
  return proxyJson(
    await backendFetch("/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
    })
  )
}
