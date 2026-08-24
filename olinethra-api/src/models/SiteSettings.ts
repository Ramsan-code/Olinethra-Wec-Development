import { Schema, model } from "mongoose"

export interface ILocationSettings {

  name: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  region?: string
  postalCode?: string
  country: string
  latitude?: number
  longitude?: number
  placeId?: string
  googleMapsUrl?: string
  zoom: number
  showMap: boolean
  showAddress: boolean
  showDirections: boolean
  note?: string
}

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
  location?: ILocationSettings
}

const locationSchema = new Schema<ILocationSettings>(
  {
    name: { type: String, default: "Olinethra" },
    addressLine1: { type: String, default: "Kandy Road" },
    addressLine2: { type: String, default: "" },
    city: { type: String, default: "Vavuniya" },
    region: { type: String, default: "Northern Province" },
    postalCode: { type: String, default: "43000" },
    country: { type: String, default: "Sri Lanka" },
    latitude: { type: Number, default: 8.7514 },
    longitude: { type: Number, default: 80.4971 },
    placeId: { type: String, default: "" },
    googleMapsUrl: { type: String, default: "https://maps.google.com/?q=8.7514,80.4971" },
    zoom: { type: Number, default: 14 },
    showMap: { type: Boolean, default: true },
    showAddress: { type: Boolean, default: true },
    showDirections: { type: Boolean, default: true },
    note: { type: String, default: "" },
  },
  { _id: false }
)

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
    location: { type: locationSchema, default: () => ({}) },
  },
  { timestamps: true }
)

export const SiteSettings = model<ISiteSettings>("SiteSettings", siteSettingsSchema)

