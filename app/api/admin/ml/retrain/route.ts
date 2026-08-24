import { backendFetch, proxyJson } from "@/lib/backend-api"

export async function POST() {
  return proxyJson(await backendFetch("/admin/ml/retrain", { method: "POST" }))
}
