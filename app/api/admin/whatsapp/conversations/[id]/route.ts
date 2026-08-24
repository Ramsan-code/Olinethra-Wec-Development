import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyJson(await backendFetch(`/admin/whatsapp/conversations/${id}`))
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.text()
  return proxyJson(
    await backendFetch(`/admin/whatsapp/conversations/${id}/message`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    })
  )
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.text()
  return proxyJson(
    await backendFetch(`/admin/whatsapp/conversations/${id}/lead`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body,
    })
  )
}
