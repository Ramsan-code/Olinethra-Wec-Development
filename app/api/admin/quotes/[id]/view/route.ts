import { cookies } from "next/headers"

export async function GET(_request: Request, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const cookieStore = await cookies()
  const API_BASE = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "")

  const headers = new Headers()
  const cookieHeader = cookieStore.toString()
  if (cookieHeader) headers.set("cookie", cookieHeader)

  const backendRes = await fetch(`${API_BASE}/admin/quotes/${id}/view`, {
    headers,
    cache: "no-store",
  })

  if (!backendRes.ok) {
    return new Response(await backendRes.text(), {
      status: backendRes.status,
      headers: { "content-type": backendRes.headers.get("content-type") || "application/json" },
    })
  }

  return new Response(backendRes.body, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": backendRes.headers.get("content-disposition") || 'inline; filename="quotation.pdf"',
      "cache-control": "private, no-cache, no-store, must-revalidate",
    },
  })
}
