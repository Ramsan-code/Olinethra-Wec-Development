import mongoose, { Schema, Document, Types } from "mongoose"

export type InsightType = "ARTICLE" | "TECH_BRIEF"
export type AuthorshipType = "HUMAN" | "AI" | "HUMAN_AI"
export type TargetAudience = "CLIENTS" | "DEVELOPERS" | "BOTH"
export type InsightStatus = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"

export interface IInsightPost extends Document {
  legacyId: string
  title: string
  slug: string
  excerpt: string
  content: string
  type: InsightType
  authorship: AuthorshipType
  authorName: string
  authorRole?: string
  authorAvatar?: string
  ai?: {
    provider?: string
    model?: string
    generatedAt?: Date
    reviewedBy?: string
    reviewedAt?: Date
    promptSummary?: string
  }
  category: Types.ObjectId
  categoryName?: string
  tags: string[]
  audience: TargetAudience
  coverImage?: {
    url: string
    publicId?: string
    alt?: string
  }
  status: InsightStatus
  featured: boolean
  readingTimeMinutes: number
  views: number
  ctaClicks: number
  source?: {
    name?: string
    url?: string
    publishedAt?: Date
    commentary?: string
    whatHappened?: string
    whyItMatters?: string
    whoShouldCare?: string
  }
  seo?: {
    title?: string
    description?: string
    canonicalUrl?: string
  }
  publishedAt?: Date
  createdBy: string
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
}

const insightPostSchema = new Schema<IInsightPost>(
  {
    legacyId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    type: {
      type: String,
      enum: ["ARTICLE", "TECH_BRIEF"],
      default: "ARTICLE",
      index: true,
    },
    authorship: {
      type: String,
      enum: ["HUMAN", "AI", "HUMAN_AI"],
      default: "HUMAN",
    },
    authorName: { type: String, default: "Olinethra Team" },
    authorRole: { type: String, default: "Engineering Studio" },
    authorAvatar: { type: String, default: "" },
    ai: {
      provider: { type: String },
      model: { type: String },
      generatedAt: { type: Date },
      reviewedBy: { type: String },
      reviewedAt: { type: Date },
      promptSummary: { type: String },
    },
    category: { type: Schema.Types.ObjectId, ref: "InsightCategory", required: true },
    categoryName: { type: String, default: "Engineering" },
    tags: [{ type: String, trim: true }],
    audience: {
      type: String,
      enum: ["CLIENTS", "DEVELOPERS", "BOTH"],
      default: "BOTH",
    },
    coverImage: {
      url: { type: String },
      publicId: { type: String },
      alt: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    readingTimeMinutes: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    ctaClicks: { type: Number, default: 0 },
    source: {
      name: { type: String },
      url: { type: String },
      publishedAt: { type: Date },
      commentary: { type: String },
      whatHappened: { type: String },
      whyItMatters: { type: String },
      whoShouldCare: { type: String },
    },
    seo: {
      title: { type: String },
      description: { type: String },
      canonicalUrl: { type: String },
    },
    publishedAt: { type: Date, index: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String },
  },
  { timestamps: true }
)

insightPostSchema.index({ status: 1, publishedAt: -1 })
insightPostSchema.index({ category: 1, status: 1 })
insightPostSchema.index({ tags: 1, status: 1 })

export const InsightPost =
  mongoose.models.InsightPost ||
  mongoose.model<IInsightPost>("InsightPost", insightPostSchema)
