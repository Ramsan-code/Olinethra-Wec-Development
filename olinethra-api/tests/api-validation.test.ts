import { describe, expect, it } from "vitest"
import request from "supertest"
import { app } from "../src/app.js"

describe("public API validation", () => {
  it("returns 400 for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/v1/inquiries")
      .set("Content-Type", "application/json")
      .send('{"name":')

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      success: false,
      error: { code: "MALFORMED_JSON" },
    })
  })

  it("rejects unknown inquiry fields and whitespace-only messages", async () => {
    const response = await request(app).post("/api/v1/inquiries").send({
      name: "Visitor",
      email: "visitor@example.com",
      message: "   ",
      role: "Super Admin",
    })

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe("VALIDATION_ERROR")
  })

  it("bounds chatbot history and message size", async () => {
    const messages = Array.from({ length: 21 }, () => ({ role: "user", content: "hello" }))
    const response = await request(app).post("/api/v1/chat").send({ messages })

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe("VALIDATION_ERROR")
  })

  it("rejects application fields outside the contract before database access", async () => {
    const response = await request(app).post("/api/v1/applications").send({
      applicantName: "Applicant",
      email: "applicant@example.com",
      opportunityTitle: "Engineer",
      opportunityType: "Job",
      resumeUrl: "https://example.com/resume.pdf",
      status: "Accepted",
    })

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe("VALIDATION_ERROR")
  })
})
