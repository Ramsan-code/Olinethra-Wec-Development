import { Schema, model } from "mongoose"

export interface IApplication {
  legacyId: string
  applicantName: string
  email: string
  phone: string
  opportunityTitle: string
  opportunityType: "Internship" | "Job"
  resumeUrl: string
  coverNote?: string
  appliedDate: string
  status: "New" | "Reviewing" | "Shortlisted" | "Rejected" | "Accepted"
}

const applicationSchema = new Schema<IApplication>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    applicantName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, default: "" },
    opportunityTitle: { type: String, required: true },
    opportunityType: { type: String, enum: ["Internship", "Job"], required: true },
    resumeUrl: { type: String, required: true },
    coverNote: String,
    appliedDate: { type: String, index: true },
    status: {
      type: String,
      enum: ["New", "Reviewing", "Shortlisted", "Rejected", "Accepted"],
      default: "New",
      index: true,
    },
  },
  { timestamps: true }
)

applicationSchema.index({ status: 1, createdAt: -1 })

export const Application = model<IApplication>("Application", applicationSchema)
