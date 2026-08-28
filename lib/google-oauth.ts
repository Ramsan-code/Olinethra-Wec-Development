import "server-only"
import crypto from "node:crypto"

export const GOOGLE_FLOW_COOKIE = "olinethra_google_oauth"
export const GOOGLE_CALLBACK_PATH = "/api/admin/auth/google/callback"

export interface GoogleFlowState {
  state: string
  nonce: string
  verifier: string
  next: string
}

export function safeAdminPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("\\")) return "/admin"
  return value
}

export function googleRedirectUri() {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return `${appUrl.replace(/\/$/, "")}${GOOGLE_CALLBACK_PATH}`
}

export function encodeFlow(value: GoogleFlowState) {
  return Buffer.from(JSON.stringify(value)).toString("base64url")
}

export function decodeFlow(value?: string): GoogleFlowState | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<GoogleFlowState>
    if (!parsed.state || !parsed.nonce || !parsed.verifier || !parsed.next) return null
    return parsed as GoogleFlowState
  } catch {
    return null
  }
}

export function randomBase64Url(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url")
}

export function sha256Base64Url(value: string) {
  return crypto.createHash("sha256").update(value).digest("base64url")
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
