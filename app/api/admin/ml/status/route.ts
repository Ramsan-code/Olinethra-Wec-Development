import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function GET() {
  return proxyJson(await backendFetch("/admin/ml/status", { cache: "no-store" }))
}
