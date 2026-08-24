import { describe, expect, it, vi } from "vitest"
import request from "supertest"
import { app } from "../src/app.js"
import { processWhatsAppMessage } from "../src/services/ai/whatsappAgent.service.js"
import type { IConversation } from "../src/models/Conversation.js"

vi.mock("../src/services/cms.service.js", () => ({
  saveCmsSnapshot: async () => ({
    team: [],
    internships: [{ title: "Full Stack Intern", status: "Open", workType: "Remote", duration: "3 Months", deadline: "2026-12-31" }],
    jobs: [{ title: "Senior Full Stack Engineer", status: "Open", employmentType: "Full-Time", workType: "Remote", location: "Global" }],
    projects: [{ title: "Book Locator", category: "Web App", status: "Published", description: "Search local libraries" }],
    services: [{ title: "Web Application Development", shortDesc: "Custom Next.js & Node.js development", status: "Active" }],
    faqs: [{ question: "What is Olinethra?", answer: "Olinethra is a software studio.", published: true }],
    chatbotKnowledge: [],
    siteSettings: { company: "Olinethra" },
    applications: [],
    inquiries: [],
    notifications: [],
    activityLog: [],
  }),
}))

describe("WhatsApp Agent & Webhook System", () => {
  it("verifies webhook with valid verify token", async () => {
    const response = await request(app)
      .get("/api/v1/webhooks/whatsapp")
      .query({
        "hub.mode": "subscribe",
        "hub.verify_token": "olinethra_whatsapp_verify_token",
        "hub.challenge": "123456789",
      })

    expect(response.status).toBe(200)
    expect(response.text).toBe("123456789")
  })

  it("rejects webhook verification with invalid token", async () => {
    const response = await request(app)
      .get("/api/v1/webhooks/whatsapp")
      .query({
        "hub.mode": "subscribe",
        "hub.verify_token": "wrong_token",
        "hub.challenge": "123456789",
      })

    expect(response.status).toBe(403)
  })

  it("handles incoming webhook POST with 200 OK", async () => {
    const response = await request(app)
      .post("/api/v1/webhooks/whatsapp")
      .send({
        object: "whatsapp_business_account",
        entry: [
          {
            id: "WHATSAPP_ENTRY_ID",
            changes: [
              {
                field: "messages",
                value: {
                  messaging_product: "whatsapp",
                  metadata: {
                    display_phone_number: "15550192834",
                    phone_number_id: "100000000000000",
                  },
                  contacts: [{ profile: { name: "Test User" }, wa_id: "15559998888" }],
                  messages: [
                    {
                      from: "15559998888",
                      id: "wamid.test_12345",
                      timestamp: "1700000000",
                      type: "text",
                      text: { body: "Hello" },
                    },
                  ],
                },
              },
            ],
          },
        ],
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: "EVENT_RECEIVED" })
  })

  it("provides concise welcome experience for greetings", async () => {
    const mockConversation = {
      _id: "507f191e810c19729de860ea",
      whatsappUserId: "15559998888",
      phone: "15559998888",
      displayName: "Test User",
      status: "NEW",
      aiEnabled: true,
      save: async () => mockConversation,
    } as unknown as IConversation

    const res = await processWhatsAppMessage(mockConversation, "Hello")
    expect(res.reply).toContain("Hi 👋 Welcome to Olinethra.")
    expect(res.reply).toContain("1. Start a project")
    expect(res.reply).toContain("6. Talk to our team")
  })

  it("triggers human handoff and pauses AI when requested", async () => {
    let saved = false
    const mockConversation = {
      _id: "507f191e810c19729de860ea",
      whatsappUserId: "15559998888",
      phone: "15559998888",
      displayName: "Test User",
      status: "NEW",
      aiEnabled: true,
      save: async () => {
        saved = true
      },
    } as unknown as IConversation

    const res = await processWhatsAppMessage(mockConversation, "I need to talk to a human agent")
    expect(res.humanHandoffTriggered).toBe(true)
    expect(mockConversation.aiEnabled).toBe(false)
    expect(mockConversation.status).toBe("HUMAN_HANDOFF")
    expect(res.reply).toContain("I'll pass this conversation to the Olinethra team")
    expect(saved).toBe(true)
  })

  it("returns open internships from live CMS snapshot", async () => {
    const mockConversation = {
      _id: "507f191e810c19729de860ea",
      whatsappUserId: "15559998888",
      phone: "15559998888",
      displayName: "Test User",
      status: "NEW",
      aiEnabled: true,
      save: async () => mockConversation,
    } as unknown as IConversation

    const res = await processWhatsAppMessage(mockConversation, "Do you have any internships?")
    expect(res.intent).toBe("INTERNSHIP")
    expect(res.reply).toContain("Full Stack Intern")
  })
})
