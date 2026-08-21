import { Schema, model } from "mongoose"

export interface IService {
  legacyId: string
  title: string
  shortDesc: string
  fullDesc: string
  iconName: string
  features: string[]
  deliverables: string[]
  displayOrder: number
  status: "Active" | "Inactive"
}

const serviceSchema = new Schema<IService>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    shortDesc: { type: String, required: true },
    fullDesc: { type: String, required: true },
    iconName: { type: String, default: "Code2" },
    features: { type: [String], default: [] },
    deliverables: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0, index: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active", index: true },
  },
  { timestamps: true }
)

export const Service = model<IService>("Service", serviceSchema)
