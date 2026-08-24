import { Schema, model } from "mongoose"

export interface IQuote {
  legacyId: string
  title: string
  clientName?: string
  companyName?: string
  quotationNumber?: string
  quotationDate?: Date
  projectName?: string
  notes?: string
  file: {
    url: string
    publicId: string
    originalName: string
    format: string
    bytes?: number
  }
  uploadedBy: string
  linkedInquiryId?: string
  linkedLeadId?: string
  tags?: string[]
  createdAt?: Date
  updatedAt?: Date
}

const quoteSchema = new Schema<IQuote>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    clientName: { type: String, trim: true, index: true },
    companyName: { type: String, trim: true, index: true },
    quotationNumber: { type: String, trim: true, index: true },
    quotationDate: { type: Date, index: true },
    projectName: { type: String, trim: true },
    notes: { type: String, trim: true },
    file: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      originalName: { type: String, required: true },
      format: { type: String, required: true, default: "pdf" },
      bytes: { type: Number },
    },
    uploadedBy: { type: String, required: true },
    linkedInquiryId: { type: String },
    linkedLeadId: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
)

quoteSchema.index({ createdAt: -1 })
quoteSchema.index({ title: "text", clientName: "text", companyName: "text", quotationNumber: "text", projectName: "text" })

export const Quote = model<IQuote>("Quote", quoteSchema)
