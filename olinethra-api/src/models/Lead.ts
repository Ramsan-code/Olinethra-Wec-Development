import { Schema, model, Document, Types } from "mongoose"

export type LeadStatus =
  | "NEW"
  | "QUALIFYING"
  | "QUALIFIED"
  | "HUMAN_HANDOFF"
  | "CONTACTED"
  | "DISCUSSION"
  | "PROPOSAL"
  | "WON"
  | "LOST"

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH"


export interface ILeadMlPrediction {
  status: "COLLECTING_DATA" | "READY" | "ACTIVE" | "DEGRADED" | "DISABLED"
  conversionProbability?: number | null
  completenessScore: number
  scoreBand: "LOW" | "MEDIUM" | "HIGH"
  modelVersion: string
  algorithm?: string
  confidence?: string
  scoredAt: Date
  notice?: string | null
  explanation: {
    positiveSignals: string[]
    negativeSignals: string[]
    uncertainSignals: string[]
  }
}

export interface ILead extends Document {
  legacyId: string
  name: string
  phone?: string
  email?: string
  company?: string
  source: string
  projectType?: string
  projectSummary?: string
  features: string[]
  budget?: string
  timeline?: string
  status: LeadStatus
  priority: LeadPriority
  conversationId?: Types.ObjectId
  whatsappUserId?: string
  assignedTo?: string
  notes?: string
  ml?: ILeadMlPrediction
  createdAt: Date
  updatedAt: Date
}

const leadSchema = new Schema<ILead>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, default: "WhatsApp Lead" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    company: { type: String, default: "" },
    source: { type: String, default: "WHATSAPP", index: true },
    projectType: { type: String, default: "Web Application" },
    projectSummary: { type: String, default: "" },
    features: { type: [String], default: [] },
    budget: { type: String, default: "Not specified" },
    timeline: { type: String, default: "Not specified" },
    status: {
      type: String,
      enum: [
        "NEW",
        "QUALIFYING",
        "QUALIFIED",
        "HUMAN_HANDOFF",
        "CONTACTED",
        "DISCUSSION",
        "PROPOSAL",
        "WON",
        "LOST",
      ],
      default: "NEW",
      index: true,
    },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM", index: true },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
    whatsappUserId: { type: String, index: true },
    assignedTo: { type: String, default: "Unassigned" },
    notes: { type: String, default: "" },
    ml: {
      status: { type: String, default: "COLLECTING_DATA" },
      conversionProbability: { type: Number, default: null },
      completenessScore: { type: Number, default: 0 },
      scoreBand: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "LOW" },
      modelVersion: { type: String, default: "lead-conversion-v1" },
      algorithm: { type: String },
      confidence: { type: String },
      scoredAt: { type: Date, default: Date.now },
      notice: { type: String, default: null },
      explanation: {
        positiveSignals: { type: [String], default: [] },
        negativeSignals: { type: [String], default: [] },
        uncertainSignals: { type: [String], default: [] },
      },
    },
  },
  { timestamps: true }
)


leadSchema.index({ source: 1, status: 1, createdAt: -1 })

export const Lead = model<ILead>("Lead", leadSchema)
