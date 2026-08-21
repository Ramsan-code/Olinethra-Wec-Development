import { describe, expect, it, vi } from "vitest"
import { requireRole } from "../src/middleware/role.middleware.js"

function request(role: "Super Admin" | "Content Admin" | "Hiring Admin") {
  return { user: { id: "u1", name: "Admin", email: "admin@example.com", role } }
}

describe("role authorization", () => {
  it("allows super admins", () => {
    const next = vi.fn()
    requireRole("users")(request("Super Admin") as never, {} as never, next)
    expect(next).toHaveBeenCalledWith()
  })

  it("allows content admins to manage projects", () => {
    const next = vi.fn()
    requireRole("projects")(request("Content Admin") as never, {} as never, next)
    expect(next).toHaveBeenCalledWith()
  })

  it("rejects hiring admins from projects", () => {
    const next = vi.fn()
    requireRole("projects")(request("Hiring Admin") as never, {} as never, next)
    expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 403, code: "FORBIDDEN" })
  })

  it("rejects unauthenticated requests", () => {
    const next = vi.fn()
    requireRole("projects")({} as never, {} as never, next)
    expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 401, code: "UNAUTHORIZED" })
  })
})
