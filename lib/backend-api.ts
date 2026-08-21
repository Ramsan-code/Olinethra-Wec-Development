import { cookies } from "next/headers"

const API_BASE = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "")

export async function backendFetch(path: string, init: RequestInit = {}) {
  const cookieStore = await cookies()
  const headers = new Headers(init.headers)
  headers.set("accept", "application/json")
  const cookieHeader = cookieStore.toString()
  if (cookieHeader) headers.set("cookie", cookieHeader)
  return fetch(`${API_BASE}${path}`, { ...init, headers, cache: "no-store", signal: init.signal ?? AbortSignal.timeout(15_000) })
}

export async function proxyJson(response: Response) {
  const proxied = new Response(await response.text(), {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") || "application/json" },
  })
  const getSetCookie = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie
  const values = getSetCookie ? getSetCookie.call(response.headers) : []
  for (const value of values) proxied.headers.append("set-cookie", value)
  if (!values.length) {
    const value = response.headers.get("set-cookie")
    if (value) proxied.headers.append("set-cookie", value)
  }
  return proxied
}
