import { describe, expect, it } from "vitest"
import { pickWritableFields } from "../src/services/cms.service.js"

describe("legacy CMS mass-assignment protection", () => {
  it("only lets hiring admins change an application's status through the CMS payload", () => {
    expect(
      pickWritableFields("applications", {
        status: "Shortlisted",
        email: "attacker@example.com",
        resumeUrl: "https://example.com/replaced.pdf",
        createdBy: "another-user",
      })
    ).toEqual({ status: "Shortlisted" })
  })

  it("drops database and identity fields from content updates", () => {
    expect(
      pickWritableFields("projects", {
        title: "Safe title",
        status: "Published",
        legacyId: "reassigned",
        _id: "reassigned",
        __v: 99,
        createdBy: "another-user",
      })
    ).toEqual({ title: "Safe title", status: "Published" })
  })

  it("limits notification updates to read state", () => {
    expect(pickWritableFields("notifications", { read: true, message: "tampered" })).toEqual({ read: true })
  })
})
