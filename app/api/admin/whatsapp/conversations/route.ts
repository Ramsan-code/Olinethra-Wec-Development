import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryString = searchParams.toString()
  return proxyJson(
    await backendFetch(`/admin/whatsapp/conversations${queryString ? `?${queryString}` : ""}`)
  )
}
