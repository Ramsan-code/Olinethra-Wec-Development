import { cookies } from "next/headers"
import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryString = searchParams.toString()
  const path = `/admin/quotes${queryString ? `?${queryString}` : ""}`
  
  return proxyJson(await backendFetch(path))
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const API_BASE = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "")
  
  const headers = new Headers()
  headers.set("accept", "application/json")
  
  const contentType = request.headers.get("content-type")
  if (contentType) headers.set("content-type", contentType)
  
  const cookieHeader = cookieStore.toString()
  if (cookieHeader) headers.set("cookie", cookieHeader)
  
  const response = await fetch(`${API_BASE}/admin/quotes`, {
    method: "POST",
    headers,
    body: await request.arrayBuffer(),
    cache: "no-store",
  })

  return proxyJson(response)
}
