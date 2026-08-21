import { Schema, model } from "mongoose"

export interface ITeamMember {
  legacyId: string
  name: string
  role: string
  department: string
  bio: string
  photoUrl: string
  skills: string[]
  linkedin?: string
  github?: string
  portfolio?: string
  email?: string
  displayOrder: number
  status: "Active" | "Inactive"
  published?: boolean
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, default: "Engineering" },
    bio: { type: String, default: "" },
    photoUrl: { type: String, required: true },
    skills: { type: [String], default: [] },
    linkedin: String,
    github: String,
    portfolio: String,
    email: String,
    displayOrder: { type: Number, default: 0, index: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active", index: true },
    published: Boolean,
  },
  { timestamps: true }
)

teamMemberSchema.index({ status: 1, displayOrder: 1 })

export const TeamMember = model<ITeamMember>("TeamMember", teamMemberSchema)
