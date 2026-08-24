import { execFile } from "child_process"
import path from "path"
import fs from "fs"
import { Lead, type ILead, type ILeadMlPrediction } from "../models/Lead.js"
import { logActivity } from "./activity.service.js"
import type { AuthUser } from "../types/index.js"

const ROOT_DIR = path.resolve(process.cwd(), "..")
const ML_DIR = path.join(ROOT_DIR, "ml")
const VENV_PYTHON = path.join(ML_DIR, "venv", "bin", "python")
const PREDICT_SCRIPT = path.join(ML_DIR, "predict.py")
const TRAIN_SCRIPT = path.join(ML_DIR, "train_lead_model.py")
const EXPORT_SCRIPT = path.join(ML_DIR, "export_leads.py")
const ARTIFACTS_DIR = path.join(ML_DIR, "artifacts")
const DATA_DIR = path.join(ML_DIR, "data")

export interface MlStatusResponse {
  status: "COLLECTING_DATA" | "READY" | "ACTIVE" | "DEGRADED" | "DISABLED"
  isReady: boolean
  totalLeads: number
  totalLabeled: number
  wonCount: number
  lostCount: number
  unresolvedCount: number
  thresholds: {
    minLabeledLeads: number
    minPositiveSamples: number
    minNegativeSamples: number
  }
  activeModel?: {
    modelVersion?: string
    algorithm?: string
    trainedAt?: string
    trainingSamples?: number
    positiveSamples?: number
    negativeSamples?: number
  }
  metrics?: Record<string, unknown>
  reasons: string[]
}

function calculateDeterministicCompleteness(lead: Partial<ILead>): number {
  let score = 0

  if (lead.projectType && lead.projectType.toLowerCase() !== "not specified") {
    score += 15
  }

  const summary = lead.projectSummary || lead.notes || ""
  if (summary.trim().length >= 15) {
    score += 25
  } else if (summary.trim().length > 0) {
    score += 10
  }

  if (Array.isArray(lead.features) && lead.features.length > 0) {
    score += 20
  }

  if (lead.budget && lead.budget.toLowerCase() !== "not specified") {
    score += 15
  }

  if (lead.timeline && lead.timeline.toLowerCase() !== "not specified") {
    score += 15
  }

  if (lead.email || lead.phone) {
    score += 10
  }

  return Math.min(100, score)
}

export async function runPythonPredict(leadData: Record<string, unknown>): Promise<ILeadMlPrediction> {
  return new Promise((resolve) => {
    const pythonBin = fs.existsSync(VENV_PYTHON) ? VENV_PYTHON : "python3"
    const leadJson = JSON.stringify(leadData)

    execFile(pythonBin, [PREDICT_SCRIPT, leadJson], { cwd: ML_DIR, timeout: 5000 }, (error, stdout) => {
      if (error || !stdout) {
        console.warn("[ML SCORING] Python predict subprocess fallback:", error?.message)
        const completeness = calculateDeterministicCompleteness(leadData as any)
        const band = completeness >= 70 ? "HIGH" : completeness >= 40 ? "MEDIUM" : "LOW"

        resolve({
          status: "COLLECTING_DATA",
          conversionProbability: null,
          completenessScore: completeness,
          scoreBand: band,
          modelVersion: "lead-conversion-v1",
          algorithm: "Completeness Evaluator",
          confidence: "Low",
          scoredAt: new Date(),
          notice: "Lead prediction is not available yet. Olinethra is collecting historical lead outcomes before enabling machine-learning predictions.",
          explanation: {
            positiveSignals: completeness >= 70 ? [`High completeness score (${completeness}%)`] : [],
            negativeSignals: [],
            uncertainSignals: completeness < 70 ? ["Collecting historical lead outcome data"] : [],
          },
        })
        return
      }

      try {
        const parsed = JSON.parse(stdout.trim())
        resolve({
          status: parsed.status || "COLLECTING_DATA",
          conversionProbability: parsed.conversionProbability ?? null,
          completenessScore: parsed.completenessScore ?? 0,
          scoreBand: parsed.scoreBand || "LOW",
          modelVersion: parsed.modelVersion || "lead-conversion-v1",
          algorithm: parsed.algorithm || "scikit-learn",
          confidence: parsed.confidence || "Medium",
          scoredAt: new Date(),
          notice: parsed.notice || null,
          explanation: {
            positiveSignals: parsed.explanation?.positiveSignals || [],
            negativeSignals: parsed.explanation?.negativeSignals || [],
            uncertainSignals: parsed.explanation?.uncertainSignals || [],
          },
        })
      } catch (parseErr) {
        console.error("[ML SCORING] Failed to parse Python prediction stdout:", parseErr)
        const completeness = calculateDeterministicCompleteness(leadData as any)
        resolve({
          status: "COLLECTING_DATA",
          conversionProbability: null,
          completenessScore: completeness,
          scoreBand: completeness >= 70 ? "HIGH" : completeness >= 40 ? "MEDIUM" : "LOW",
          modelVersion: "lead-conversion-v1",
          scoredAt: new Date(),
          notice: "Lead prediction is not available yet. Olinethra is collecting historical lead outcomes before enabling machine-learning predictions.",
          explanation: { positiveSignals: [], negativeSignals: [], uncertainSignals: [] },
        })
      }
    })
  })
}

export async function scoreLead(lead: ILead): Promise<ILead> {
  try {
    const rawData = {
      legacyId: lead.legacyId,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      company: lead.company,
      source: lead.source,
      projectType: lead.projectType,
      projectSummary: lead.projectSummary,
      features: lead.features,
      budget: lead.budget,
      timeline: lead.timeline,
      status: lead.status,
      notes: lead.notes,
    }

    const prediction = await runPythonPredict(rawData)
    lead.ml = prediction

    // Align lead priority with ML scoreBand if not manually overridden
    if (prediction.scoreBand) {
      lead.priority = prediction.scoreBand
    }

    await lead.save()
    return lead
  } catch (err) {
    console.error("[ML SCORING FAILSAFE] Error scoring lead:", err)
    return lead
  }
}

export async function getMlSystemStatus(): Promise<MlStatusResponse> {
  const [totalLeads, wonCount, lostCount] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: "WON" }),
    Lead.countDocuments({ status: "LOST" }),
  ])

  const totalLabeled = wonCount + lostCount
  const unresolvedCount = totalLeads - totalLabeled

  const minLabeled = 100
  const minPos = 25
  const minNeg = 25

  const isReady = totalLabeled >= minLabeled && wonCount >= minPos && lostCount >= minNeg

  const reasons: string[] = []
  if (totalLabeled < minLabeled) {
    reasons.push(`Labeled resolved leads (${totalLabeled}) below minimum threshold (${minLabeled}).`)
  }

  if (wonCount < minPos) {
    reasons.push(`WON leads (${wonCount}) below minimum threshold (${minPos}).`)
  }
  if (lostCount < minNeg) {
    reasons.push(`LOST leads (${lostCount}) below minimum threshold (${minNeg}).`)
  }

  let activeModel: MlStatusResponse["activeModel"] = undefined
  let metrics: Record<string, unknown> | undefined = undefined
  let status: MlStatusResponse["status"] = isReady ? "READY" : "COLLECTING_DATA"

  const metaPath = path.join(ARTIFACTS_DIR, "metadata.json")
  const metricsPath = path.join(ARTIFACTS_DIR, "metrics.json")

  if (fs.existsSync(metaPath)) {
    try {
      const metaContent = JSON.parse(fs.readFileSync(metaPath, "utf-8"))
      if (metaContent.status === "ACTIVE") {
        status = "ACTIVE"
        activeModel = {
          modelVersion: metaContent.modelVersion,
          algorithm: metaContent.algorithm,
          trainedAt: metaContent.trainedAt,
          trainingSamples: metaContent.trainingSamples,
          positiveSamples: metaContent.positiveSamples,
          negativeSamples: metaContent.negativeSamples,
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }

  if (fs.existsSync(metricsPath)) {
    try {
      metrics = JSON.parse(fs.readFileSync(metricsPath, "utf-8"))
    } catch {
      // ignore
    }
  }

  return {
    status,
    isReady,
    totalLeads,
    totalLabeled,
    wonCount,
    lostCount,
    unresolvedCount,
    thresholds: {
      minLabeledLeads: minLabeled,
      minPositiveSamples: minPos,
      minNegativeSamples: minNeg,
    },
    activeModel,
    metrics,
    reasons: totalLabeled < minLabeled ? [`Labeled leads count (${totalLabeled}/${minLabeled}) is currently in Data Collection phase.`] : reasons,
  }
}

export async function rescoreOpenLeads(user?: AuthUser): Promise<number> {
  const openLeads = await Lead.find({
    status: { $in: ["NEW", "QUALIFYING", "QUALIFIED", "HUMAN_HANDOFF", "CONTACTED", "DISCUSSION", "PROPOSAL"] },
  })

  let count = 0
  for (const lead of openLeads) {
    await scoreLead(lead)
    count++
  }

  if (user) {
    await logActivity({
      user: user.name || user.email,
      action: "Rescored Open Leads",
      entity: "lead",
      metadata: { rescoredCount: count },
    })
  }

  return count
}

export async function triggerDatasetExportAndTraining(user?: AuthUser): Promise<{ success: boolean; message: string }> {
  const leads = await Lead.find().lean()
  const dataFile = path.join(DATA_DIR, "leads.json")

  const sanitizedData = leads.map((l) => ({
    id: l.legacyId,
    status: l.status,
    source: l.source,
    projectType: l.projectType,
    projectSummary: l.projectSummary,
    features: l.features,
    budget: l.budget,
    timeline: l.timeline,
    phone: l.phone,
    email: l.email,
    company: l.company,
    notes: l.notes,
    createdAt: l.createdAt,
  }))

  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(dataFile, JSON.stringify(sanitizedData, null, 2), "utf-8")

  const pythonBin = fs.existsSync(VENV_PYTHON) ? VENV_PYTHON : "python3"

  return new Promise((resolve) => {
    execFile(pythonBin, [TRAIN_SCRIPT], { cwd: ML_DIR, timeout: 30000 }, async (error, stdout) => {
      const outputMsg = stdout ? stdout.slice(0, 300) : error?.message || "Training executed."
      const isSuccess = !error && !outputMsg.includes("status to COLLECTING_DATA")

      if (user) {
        await logActivity({
          user: user.name || user.email,
          action: isSuccess ? "Trained ML Lead Conversion Model" : "Evaluated ML Dataset Readiness",
          entity: "lead",
          metadata: { output: outputMsg },
        })
      }

      resolve({
        success: isSuccess,
        message: outputMsg,
      })
    })
  })
}
