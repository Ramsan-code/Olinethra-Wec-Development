import { Schema, model } from "mongoose"

export interface IInternship {
  legacyId: string
  title: string
  department: string
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  duration: string
  location: string
  workType: "Remote" | "Hybrid" | "On-site"
  deadline: string
  vacancies: number
  status: "Open" | "Closed" | "Draft"
  applicationLink: string
  isFeatured: boolean
}

const internshipSchema = new Schema<IInternship>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    department: { type: String, default: "Engineering" },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    duration: { type: String, default: "3 - 6 Months" },
    location: { type: String, default: "Remote" },
    workType: { type: String, enum: ["Remote", "Hybrid", "On-site"], default: "Remote" },
    deadline: { type: String, index: true },
    vacancies: { type: Number, default: 1 },
    status: { type: String, enum: ["Open", "Closed", "Draft"], default: "Open", index: true },
    applicationLink: { type: String, default: "mailto:careers@olinethra.com" },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

internshipSchema.index({ status: 1, deadline: 1 })

export const Internship = model<IInternship>("Internship", internshipSchema)
