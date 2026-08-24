import mongoose, { Schema, Document } from "mongoose"

export interface IInsightCategory extends Document {
  legacyId: string
  name: string
  slug: string
  description?: string
  displayOrder: number
  isDefault?: boolean
  createdAt: Date
  updatedAt: Date
}

const insightCategorySchema = new Schema<IInsightCategory>(
  {
    legacyId: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const InsightCategory =
  mongoose.models.InsightCategory ||
  mongoose.model<IInsightCategory>("InsightCategory", insightCategorySchema)
