import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxyJson(
    await backendFetch(`/admin/insights/${encodeURIComponent(id)}/ai-assist`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
    })
  )
}
