import { Schema, model } from "mongoose"

export interface IChatbotKnowledge {
  legacyId: string
  topic: string
  question: string
  answer: string
  category: string
  lastUpdated: string
}

const chatbotKnowledgeSchema = new Schema<IChatbotKnowledge>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    topic: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "General" },
    lastUpdated: { type: String },
  },
  { timestamps: true }
)

export const ChatbotKnowledge = model<IChatbotKnowledge>("ChatbotKnowledge", chatbotKnowledgeSchema)
