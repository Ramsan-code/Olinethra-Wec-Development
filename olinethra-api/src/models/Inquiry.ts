import { Schema, model } from "mongoose"

export interface IInquiry {
  legacyId: string
  name: string
  email: string
  company: string
  projectType: string
  budget?: string
  priority?: "HIGH" | "MEDIUM" | "LOW"
  message: string
  date: string
  status: "New" | "Contacted" | "Discussion" | "Proposal" | "Won" | "Lost"
}

const inquirySchema = new Schema<IInquiry>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    company: { type: String, default: "N/A" },
    projectType: { type: String, default: "Web Application" },
    budget: String,
    priority: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], default: "MEDIUM", index: true },
    message: { type: String, required: true },
    date: { type: String, index: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Discussion", "Proposal", "Won", "Lost"],
      default: "New",
      index: true,
    },
  },
  { timestamps: true }
)

inquirySchema.index({ status: 1, createdAt: -1 })

export const Inquiry = model<IInquiry>("Inquiry", inquirySchema)
