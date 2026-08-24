import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET() {
  return proxyJson(await backendFetch("/users"))
}

export async function POST(request: Request) {
  return proxyJson(
    await backendFetch("/users/invite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
    })
  )
}
