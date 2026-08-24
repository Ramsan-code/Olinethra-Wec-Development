import { describe, it, expect, vi } from "vitest"
import * as leadScoringService from "../services/leadScoring.service.js"
import { Lead } from "../models/Lead.js"

describe("ML Lead Scoring System", () => {
  it("calculates requirements completeness score accurately", async () => {
    const mockLead: any = {
      projectType: "E-Commerce Web Application",
      projectSummary: "Build a modern full-stack e-commerce web platform with payment integration",
      features: ["Online Payments", "User Authentication", "Admin Dashboard"],
      budget: "$5,000 - $10,000",
      timeline: "1 - 2 months",
      email: "client@example.com",
      phone: "+1234567890",
    }

    const prediction = await leadScoringService.runPythonPredict(mockLead)
    expect(prediction.completenessScore).toBe(100)
    expect(prediction.scoreBand).toBe("HIGH")
  })

  it("handles fallback COLLECTING_DATA mode when threshold is not met", async () => {
    const mockLead: any = {
      legacyId: "lead_test_001",
      name: "Test Client",
      phone: "+1987654321",
      email: "test@client.org",
      company: "Acme Corp",
      source: "WHATSAPP",
      projectType: "Corporate Website",
      projectSummary: "We need a 5-page corporate website with CMS and contact forms.",
      features: ["CMS", "Contact Form"],
      budget: "$3,000",
      timeline: "1 month",
      status: "NEW",
      notes: "High potential client",
    }

    const prediction = await leadScoringService.runPythonPredict(mockLead)

    expect(prediction).toBeDefined()
    expect(prediction.status).toBe("COLLECTING_DATA")
    expect(prediction.conversionProbability).toBeNull()
    expect(prediction.completenessScore).toBeGreaterThanOrEqual(70)
    expect(prediction.scoreBand).toBe("HIGH")
    expect(prediction.notice).toContain("Olinethra is collecting historical lead outcomes")
    expect(prediction.explanation.positiveSignals.length).toBeGreaterThan(0)
  })

  it("ensures ML system status returns configured readiness thresholds", async () => {
    vi.spyOn(Lead, "countDocuments").mockImplementation(((query?: any) => {
      if (query?.status === "WON") return Promise.resolve(5)
      if (query?.status === "LOST") return Promise.resolve(10)
      return Promise.resolve(15)
    }) as any)


    const status = await leadScoringService.getMlSystemStatus()

    expect(status).toBeDefined()
    expect(status.thresholds.minLabeledLeads).toBe(100)
    expect(status.thresholds.minPositiveSamples).toBe(25)
    expect(status.thresholds.minNegativeSamples).toBe(25)
    expect(status.isReady).toBe(false)
    expect(status.status).toBe("COLLECTING_DATA")
    expect(status.reasons.length).toBeGreaterThan(0)
  })
})
