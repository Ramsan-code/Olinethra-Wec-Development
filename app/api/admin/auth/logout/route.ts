import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function POST() {
  return proxyJson(await backendFetch("/auth/logout", { method: "POST" }))
}
