import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET(request: Request) {
  const { search } = new URL(request.url)
  return proxyJson(await backendFetch(`/admin/insights${search}`))
}

export async function POST(request: Request) {
  return proxyJson(
    await backendFetch("/admin/insights", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
    })
  )
}
