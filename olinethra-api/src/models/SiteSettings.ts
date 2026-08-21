import { Schema, model } from "mongoose"

export interface ISiteSettings {
  key: string
  heroHeading: string
  heroSubheading: string
  heroBadgeText: string
  aboutHeading: string
  aboutDescription: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  footerTagline: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, default: "default", unique: true },
    heroHeading: { type: String, required: true },
    heroSubheading: { type: String, required: true },
    heroBadgeText: { type: String, required: true },
    aboutHeading: { type: String, required: true },
    aboutDescription: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactAddress: { type: String, required: true },
    footerTagline: { type: String, required: true },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },
    facebookUrl: String,
    instagramUrl: String,
    youtubeUrl: String,
  },
  { timestamps: true }
)

export const SiteSettings = model<ISiteSettings>("SiteSettings", siteSettingsSchema)
