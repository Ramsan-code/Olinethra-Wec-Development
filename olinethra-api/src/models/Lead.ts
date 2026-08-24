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
  },
  { timestamps: true }
)

leadSchema.index({ source: 1, status: 1, createdAt: -1 })

export const Lead = model<ILead>("Lead", leadSchema)
