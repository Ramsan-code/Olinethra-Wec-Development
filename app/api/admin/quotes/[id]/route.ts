import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return proxyJson(await backendFetch(`/admin/quotes/${id}`))
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return proxyJson(
    await backendFetch(`/admin/quotes/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: await request.text(),
    })
  )
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return proxyJson(
    await backendFetch(`/admin/quotes/${id}`, {
      method: "DELETE",
    })
  )
}
