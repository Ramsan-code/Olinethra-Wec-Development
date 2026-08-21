import { Schema, model } from "mongoose"

export interface IProject {
  legacyId: string
  title: string
  slug?: string
  description: string
  thumbnail: string
  heroImage?: string
  gallery: string[]
  videoUrl?: string
  videoPoster?: string
  technologies: string[]
  category: string
  client: string
  projectUrl: string
  githubUrl?: string
  caseStudy: string
  challenges?: string
  solution?: string
  results?: string
  isFeatured: boolean
  displayOrder: number
  status: "Published" | "Draft"
  metrics?: Array<{ label: string; value: string }>
}

const projectSchema = new Schema<IProject>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    heroImage: String,
    gallery: { type: [String], default: [] },
    videoUrl: String,
    videoPoster: String,
    technologies: { type: [String], default: [] },
    category: { type: String, required: true, index: true },
    client: { type: String, default: "Client Project" },
    projectUrl: { type: String, default: "#" },
    githubUrl: String,
    caseStudy: { type: String, default: "" },
    challenges: String,
    solution: String,
    results: String,
    isFeatured: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 0, index: true },
    status: { type: String, enum: ["Published", "Draft"], default: "Draft", index: true },
    metrics: [{ label: String, value: String }],
  },
  { timestamps: true }
)

projectSchema.index({ status: 1, displayOrder: 1 })
projectSchema.index({ slug: 1, status: 1 })

export const Project = model<IProject>("Project", projectSchema)
