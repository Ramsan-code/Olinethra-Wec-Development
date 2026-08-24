import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  return proxyJson(await backendFetch(`/admin/leads/${id}/score`, { method: "POST" }))
}
