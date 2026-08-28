import { describe, expect, it } from "vitest"
import { googleAdminDenialReason } from "../src/services/auth.service.js"
import { hashRefreshTokenId, refreshTokenMatches } from "../src/middleware/auth.middleware.js"

const activeAdmin = {
  email: "admin@example.com",
  isActive: true,
  status: "ACTIVE",
  role: "Super Admin",
}

describe("Google admin authorization policy", () => {
  it("denies an unknown Google account", () => {
    expect(googleAdminDenialReason(null, "unknown@example.com", "google-1")).toBe("not_authorized")
  })

  it("denies a disabled administrator", () => {
    expect(googleAdminDenialReason({ ...activeAdmin, status: "DISABLED" }, activeAdmin.email, "google-1")).toBe("not_authorized")
  })

  it("denies an invalid role", () => {
    expect(googleAdminDenialReason({ ...activeAdmin, role: "Viewer" }, activeAdmin.email, "google-1")).toBe("not_authorized")
  })

  it("allows first binding for an approved active administrator", () => {
    expect(googleAdminDenialReason(activeAdmin, activeAdmin.email, "google-1")).toBeNull()
  })

  it("denies reassignment of a bound Google identity", () => {
    expect(googleAdminDenialReason({ ...activeAdmin, googleSubjectId: "google-1" }, activeAdmin.email, "google-2")).toBe("identity_mismatch")
  })
})

describe("refresh-token rotation identifiers", () => {
  it("matches only the stored refresh-token identifier hash", () => {
    const stored = hashRefreshTokenId("current-token-id")
    expect(refreshTokenMatches(hashRefreshTokenId("current-token-id"), stored)).toBe(true)
    expect(refreshTokenMatches(hashRefreshTokenId("rotated-old-token-id"), stored)).toBe(false)
  })
})
