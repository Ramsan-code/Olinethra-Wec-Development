import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyJson(await backendFetch(`/admin/insights/${encodeURIComponent(id)}`))
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyJson(
    await backendFetch(`/admin/insights/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: await request.text(),
    })
  )
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyJson(
    await backendFetch(`/admin/insights/${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  )
}
