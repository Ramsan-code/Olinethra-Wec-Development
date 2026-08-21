import { Schema, model } from "mongoose"

const faqCategories = [
  "General",
  "Services",
  "Pricing",
  "Development",
  "Internships",
  "Hiring",
  "Technology",
  "Projects",
] as const

export interface IFaq {
  legacyId: string
  question: string
  answer: string
  category: (typeof faqCategories)[number]
  displayOrder: number
  published: boolean
}

const faqSchema = new Schema<IFaq>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, enum: faqCategories, default: "General", index: true },
    displayOrder: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
)

export const Faq = model<IFaq>("Faq", faqSchema)
