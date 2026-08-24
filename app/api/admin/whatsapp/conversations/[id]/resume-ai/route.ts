import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyJson(
    await backendFetch(`/admin/whatsapp/conversations/${id}/resume-ai`, { method: "POST" })
  )
}
