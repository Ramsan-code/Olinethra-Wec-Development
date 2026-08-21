import { Schema, model } from "mongoose"

export interface IJob {
  legacyId: string
  title: string
  department: string
  employmentType: "Full-time" | "Part-time" | "Contract"
  location: string
  workType: "Remote" | "Hybrid" | "On-site"
  salary?: string
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  deadline: string
  applicationUrl: string
  status: "Open" | "Paused" | "Closed"
  isFeatured: boolean
}

const jobSchema = new Schema<IJob>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    department: { type: String, default: "Engineering" },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
      default: "Full-time",
    },
    location: { type: String, default: "Remote" },
    workType: { type: String, enum: ["Remote", "Hybrid", "On-site"], default: "Remote" },
    salary: String,
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    deadline: { type: String, index: true },
    applicationUrl: { type: String, default: "mailto:careers@olinethra.com" },
    status: { type: String, enum: ["Open", "Paused", "Closed"], default: "Open", index: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

jobSchema.index({ status: 1, deadline: 1 })

export const Job = model<IJob>("Job", jobSchema)
