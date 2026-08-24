import { backendFetch } from "@/lib/backend-api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryString = searchParams.toString()
  const res = await backendFetch(`/webhooks/whatsapp${queryString ? `?${queryString}` : ""}`)
  const text = await res.text()
  return new Response(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "text/plain" },
  })
}

export async function POST(request: Request) {
  const body = await request.text()
  const res = await backendFetch("/webhooks/whatsapp", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  })
  return new Response(await res.text(), {
    status: res.status,
    headers: { "content-type": "application/json" },
  })
}
