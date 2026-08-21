import bcrypt from "bcryptjs"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import type { Model } from "mongoose"
import { connectDatabase, disconnectDatabase } from "../config/database.js"
import { env } from "../config/env.js"
import {
  Application, ChatbotKnowledge, Faq, Inquiry, Internship, Job, Project,
  Service, SiteSettings, TeamMember, User,
} from "../models/index.js"

const sources = {
  team: TeamMember, internships: Internship, jobs: Job, projects: Project,
  services: Service, faqs: Faq, chatbotKnowledge: ChatbotKnowledge,
  applications: Application, inquiries: Inquiry,
} as const

async function seed() {
  await connectDatabase()
  const file = resolve(process.cwd(), "../data/cmsData.json")
  const cms = JSON.parse(await readFile(file, "utf8")) as Record<string, unknown>

  for (const [entity, SourceModel] of Object.entries(sources)) {
    const Model = SourceModel as unknown as Model<Record<string, unknown> & { legacyId: string }>
    const rows = Array.isArray(cms[entity]) ? cms[entity] as Array<Record<string, unknown>> : []
    for (const row of rows) {
      const { id, ...data } = row
      if (typeof id === "string") await Model.updateOne({ legacyId: id }, { $set: data, $setOnInsert: { legacyId: id } }, { upsert: true })
    }
  }

  if (cms.siteSettings) {
    await SiteSettings.updateOne({ key: "default" }, { $set: cms.siteSettings, $setOnInsert: { key: "default" } }, { upsert: true })
  }

  if (env.SEED_ADMIN_EMAIL && env.SEED_ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12)
    await User.updateOne(
      { email: env.SEED_ADMIN_EMAIL },
      { $set: { name: env.SEED_ADMIN_NAME || "Olinethra Administrator", passwordHash, role: "Super Admin", isActive: true }, $setOnInsert: { legacyId: "admin-primary", email: env.SEED_ADMIN_EMAIL } },
      { upsert: true }
    )
  }
  console.log("[SEED] CMS data imported")
}

seed().finally(disconnectDatabase).catch((error) => { console.error("[SEED] Failed", error instanceof Error ? error.message : "Unknown error"); process.exitCode = 1 })
