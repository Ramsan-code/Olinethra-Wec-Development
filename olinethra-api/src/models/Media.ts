import { Schema, model } from "mongoose"

export interface IMedia {
  legacyId: string
  url: string
  publicId?: string
  type: "image" | "video" | "document"
  filename: string
  folder: string
  mimeType?: string
  size?: number
  width?: number
  height?: number
  duration?: number
  alt?: string
  createdBy?: string
}

const mediaSchema = new Schema<IMedia>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    publicId: String,
    type: { type: String, enum: ["image", "video", "document"], default: "image", index: true },
    filename: { type: String, required: true },
    folder: { type: String, default: "olinethra", index: true },
    mimeType: String,
    size: Number,
    width: Number,
    height: Number,
    duration: Number,
    alt: String,
    createdBy: String,
  },
  { timestamps: true }
)

export const Media = model<IMedia>("Media", mediaSchema)
