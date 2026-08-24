import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET(request: Request) {
  const { search } = new URL(request.url)
  return proxyJson(await backendFetch(`/insights${search}`))
}
