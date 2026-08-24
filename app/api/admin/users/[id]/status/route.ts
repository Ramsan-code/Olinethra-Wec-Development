import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyJson(
    await backendFetch(`/users/${id}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: await request.text(),
    })
  )
}
