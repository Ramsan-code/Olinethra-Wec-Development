import { Schema, model, Document, Types } from "mongoose"
import type { LeadStatus } from "./Lead.js"

export interface IConversation extends Document {
  whatsappUserId: string
  phone: string
  displayName: string
  status: LeadStatus
  aiEnabled: boolean
  leadId?: Types.ObjectId
  assignedTo: string
  lastMessageAt: Date
  summary: string
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

const conversationSchema = new Schema<IConversation>(
  {
    whatsappUserId: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    displayName: { type: String, default: "WhatsApp User" },
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
    aiEnabled: { type: Boolean, default: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
    assignedTo: { type: String, default: "Unassigned", index: true },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    summary: { type: String, default: "" },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

conversationSchema.index({ whatsappUserId: 1, lastMessageAt: -1 })

export const Conversation = model<IConversation>("Conversation", conversationSchema)
