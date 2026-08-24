import {
  Project,
  TeamMember,
  Service,
  Faq,
  Internship,
  Job,
  Application,
  Inquiry,
  ChatbotKnowledge,
  SiteSettings,
  Notification,
  ActivityLog,
} from "../models/index.js"
import type { CmsExport } from "../types/index.js"
import { generateLegacyId, slugify, todayISO } from "../utils/helpers.js"
import { logActivity } from "./activity.service.js"
import { sendEmail } from "./email.service.js"
import { AppError } from "../middleware/error.middleware.js"
import type { AuthUser } from "../types/index.js"
import type { Model } from "mongoose"

type LeanDoc = Record<string, unknown> & { legacyId: string }

export function mapDoc<T extends LeanDoc>(doc: T): Omit<T, "legacyId" | "_id" | "__v"> & { id: string } {
  const { legacyId, _id, __v, ...rest } = doc as T & { _id?: unknown; __v?: unknown }
  return { ...rest, id: legacyId } as Omit<T, "legacyId" | "_id" | "__v"> & { id: string }
}

export async function runExpiryAutomation() {
  const today = todayISO()

  await Internship.updateMany(
    { deadline: { $lt: today }, status: "Open" },
    { $set: { status: "Closed" } }
  )

  await Job.updateMany({ deadline: { $lt: today }, status: "Open" }, { $set: { status: "Closed" } })
}

export async function buildCmsExport(): Promise<CmsExport> {
  await runExpiryAutomation()

  const [
    team,
    internships,
    jobs,
    projects,
    services,
    faqs,
    chatbotKnowledge,
    siteSettingsDoc,
    applications,
    inquiries,
    notifications,
    activityLog,
  ] = await Promise.all([
    TeamMember.find().sort({ displayOrder: 1 }).lean(),
    Internship.find().sort({ createdAt: -1 }).lean(),
    Job.find().sort({ createdAt: -1 }).lean(),
    Project.find().sort({ displayOrder: 1 }).lean(),
    Service.find().sort({ displayOrder: 1 }).lean(),
    Faq.find().sort({ displayOrder: 1 }).lean(),
    ChatbotKnowledge.find().sort({ createdAt: -1 }).lean(),
    SiteSettings.findOne({ key: "default" }).lean(),
    Application.find().sort({ createdAt: -1 }).lean(),
    Inquiry.find().sort({ createdAt: -1 }).lean(),
    Notification.find().sort({ createdAt: -1 }).limit(100).lean(),
    ActivityLog.find().sort({ createdAt: -1 }).limit(100).lean(),
  ])

  const defaultSettings = {
    heroHeading: "Building Digital Experiences That Matter.",
    heroSubheading: "Olinethra is a professional web development studio.",
    heroBadgeText: "AVAILABLE FOR NEW PROJECTS & COLLABORATIONS",
    aboutHeading: "An engineering-first software studio focused on craft & performance.",
    aboutDescription: "Olinethra architects bespoke digital products built for growth.",
    contactEmail: "hello@olinethra.com",
    contactPhone: "+1 (555) 019-2834",
    contactAddress: "San Francisco, CA & Global Remote",
    footerTagline: "Building high-performance digital products and scalable web applications.",
    githubUrl: "https://github.com/olinethra",
    linkedinUrl: "https://linkedin.com/company/olinethra",
    twitterUrl: "https://twitter.com/olinethra",
    location: {
      name: "Olinethra",
      addressLine1: "Kandy Road",
      addressLine2: "",
      city: "Vavuniya",
      region: "Northern Province",
      postalCode: "43000",
      country: "Sri Lanka",
      latitude: 8.7514,
      longitude: 80.4971,
      placeId: "",
      googleMapsUrl: "https://maps.google.com/?q=8.7514,80.4971",
      zoom: 14,
      showMap: true,
      showAddress: true,
      showDirections: true,
      note: "Visitors by appointment only.",
    },
  }


  const siteSettings = siteSettingsDoc
    ? (({ key, _id, __v, ...rest }) => rest)(siteSettingsDoc as Record<string, unknown>)
    : defaultSettings

  return {
    team: team.map(mapDoc),
    internships: internships.map(mapDoc),
    jobs: jobs.map(mapDoc),
    projects: projects.map(mapDoc),
    services: services.map(mapDoc),
    faqs: faqs.map(mapDoc),
    chatbotKnowledge: chatbotKnowledge.map(mapDoc),
    siteSettings: siteSettings as Record<string, unknown>,
    applications: applications.map(mapDoc),
    inquiries: inquiries.map(mapDoc),
    notifications: notifications.map(mapDoc),
    activityLog: activityLog.map(mapDoc),
  }
}

export async function saveCmsSnapshot() {
  return buildCmsExport()
}

const entityModelMap = {
  team: TeamMember,
  internships: Internship,
  jobs: Job,
  projects: Project,
  services: Service,
  faqs: Faq,
  chatbotKnowledge: ChatbotKnowledge,
  applications: Application,
  inquiries: Inquiry,
  notifications: Notification,
} as const

type EntityName = keyof typeof entityModelMap

const writableFields: Record<EntityName | "settings", readonly string[]> = {
  team: ["name", "role", "department", "bio", "photoUrl", "skills", "linkedin", "github", "portfolio", "email", "displayOrder", "status", "published"],
  internships: ["title", "department", "description", "responsibilities", "requirements", "skills", "duration", "location", "workType", "deadline", "vacancies", "status", "applicationLink", "isFeatured"],
  jobs: ["title", "department", "employmentType", "location", "workType", "salary", "description", "responsibilities", "requirements", "skills", "deadline", "applicationUrl", "status", "isFeatured"],
  projects: ["title", "slug", "description", "thumbnail", "heroImage", "gallery", "videoUrl", "videoPoster", "technologies", "category", "client", "projectUrl", "githubUrl", "caseStudy", "challenges", "solution", "results", "isFeatured", "displayOrder", "status", "metrics"],
  services: ["title", "shortDesc", "fullDesc", "iconName", "features", "deliverables", "displayOrder", "status"],
  faqs: ["question", "answer", "category", "displayOrder", "published"],
  chatbotKnowledge: ["topic", "question", "answer", "category", "lastUpdated"],
  applications: ["status"],
  inquiries: ["status", "priority"],
  notifications: ["read"],
  settings: ["heroHeading", "heroSubheading", "heroBadgeText", "aboutHeading", "aboutDescription", "contactEmail", "contactPhone", "contactAddress", "footerTagline", "githubUrl", "linkedinUrl", "twitterUrl", "facebookUrl", "instagramUrl", "youtubeUrl", "location"],
}

export function pickWritableFields(entity: EntityName | "settings", data: Record<string, unknown>) {
  const allowed = new Set(writableFields[entity])
  return Object.fromEntries(Object.entries(data).filter(([key]) => allowed.has(key)))
}

export function validateLocationData(location: Record<string, unknown>) {
  if (typeof location.latitude === "number" && (location.latitude < -90 || location.latitude > 90)) {
    throw new AppError(400, "INVALID_LOCATION", "Latitude must be between -90 and 90.")
  }
  if (typeof location.longitude === "number" && (location.longitude < -180 || location.longitude > 180)) {
    throw new AppError(400, "INVALID_LOCATION", "Longitude must be between -180 and 180.")
  }
  if (typeof location.zoom === "number" && (location.zoom < 1 || location.zoom > 21)) {
    throw new AppError(400, "INVALID_LOCATION", "Zoom must be between 1 and 21.")
  }
}

export async function handleLegacyCmsAction(
  admin: AuthUser,
  body: { action: string; entity?: string; data?: Record<string, unknown> }
) {
  const { action, entity, data } = body

  const allowedByRole: Record<AuthUser["role"], readonly string[] | "*"> = {
    "Super Admin": "*",
    "Content Admin": ["team", "projects", "services", "faqs", "chatbotKnowledge", "notifications"],
    "Hiring Admin": ["internships", "jobs", "applications", "notifications"],
  }

  if (action === "updateSettings" && admin.role !== "Super Admin") {
    throw new AppError(403, "FORBIDDEN", "Insufficient permissions.")
  }

  if (action === "updateSettings" && data) {
    if (data.location && typeof data.location === "object") {
      validateLocationData(data.location as Record<string, unknown>)
    }

    const settingsData = pickWritableFields("settings", data)
    const updated = await SiteSettings.findOneAndUpdate(
      { key: "default" },
      { $set: settingsData, $setOnInsert: { key: "default" } },
      { upsert: true, new: true }
    ).lean()

    await logActivity({
      user: admin.name,
      action: "Updated Global Site Settings & Company Location",
      entity: "Settings",
    })

    const { key: _k, _id: _i, __v: _v, ...rest } = updated as Record<string, unknown>
    return { success: true, data: rest }
  }


  if (!entity || !(entity in entityModelMap)) {
    throw new AppError(400, "INVALID_ACTION", "Invalid action or entity.")
  }

  const allowed = allowedByRole[admin.role]
  if (allowed !== "*" && !allowed.includes(entity)) {
    throw new AppError(403, "FORBIDDEN", "Insufficient permissions.")
  }

  const Model = entityModelMap[entity as EntityName] as unknown as Model<Record<string, unknown> & { legacyId: string }>

  if (action === "create" && data) {
    const legacyId = (data.id as string) || generateLegacyId(entity)
    const rest = pickWritableFields(entity as EntityName, data)

    if (entity === "projects" && rest.title && !rest.slug) {
      rest.slug = slugify(rest.title as string)
    }

    const created = await Model.create({ legacyId, ...rest })

    await logActivity({
      user: admin.name,
      action: `Created new item in ${entity}`,
      entity,
      resourceId: legacyId,
    })

    return { success: true, item: mapDoc(created.toObject() as LeanDoc) }
  }

  if (action === "update" && data?.id) {
    const legacyId = data.id as string
    const existing = await Model.findOne({ legacyId }).lean()
    if (!existing) throw new AppError(404, "NOT_FOUND", "Item not found.")

    const rest = pickWritableFields(entity as EntityName, data)
    const updated = await Model.findOneAndUpdate(
      { legacyId },
      { $set: rest },
      { new: true, runValidators: true }
    ).lean()
    if (!updated) throw new AppError(404, "NOT_FOUND", "Item not found.")

    if (entity === "applications" && existing.status !== rest.status) {
      await handleApplicationStatusEmail(
        { ...(existing as Record<string, unknown>), ...rest },
        existing.status as string,
        rest.status as string
      )
    }

    await logActivity({
      user: admin.name,
      action: `Updated item in ${entity} (${legacyId})`,
      entity,
      resourceId: legacyId,
    })

    return { success: true, item: mapDoc(updated as LeanDoc) }
  }

  if (action === "delete" && data?.id) {
    const legacyId = data.id as string
    const result = await Model.deleteOne({ legacyId })
    if (result.deletedCount === 0) {
      throw new AppError(404, "NOT_FOUND", "Item not found.")
    }

    await logActivity({
      user: admin.name,
      action: `Deleted item from ${entity}`,
      entity,
      resourceId: legacyId,
    })

    return { success: true }
  }

  throw new AppError(400, "INVALID_ACTION", "Invalid action or entity.")
}

async function handleApplicationStatusEmail(
  data: Record<string, unknown>,
  prevStatus: string,
  newStatus: string
) {
  if (prevStatus === newStatus) return

  const applicantEmail = data.email as string | undefined
  const applicantName = data.applicantName as string | undefined
  const roleTitle = data.opportunityTitle as string | undefined

  if (!applicantEmail || !applicantName || !roleTitle) return

  let emailBody = ""
  const subject = `Application Update: ${roleTitle} — Olinethra`

  if (newStatus === "Shortlisted") {
    emailBody = `Hi ${applicantName},\n\nGreat news! Your application for "${roleTitle}" at Olinethra has been shortlisted.\n\nBest regards,\nOlinethra Talent Team`
  } else if (newStatus === "Accepted") {
    emailBody = `Hi ${applicantName},\n\nCongratulations! We are pleased to extend an offer for the "${roleTitle}" position at Olinethra.\n\nBest regards,\nOlinethra Engineering`
  } else if (newStatus === "Rejected") {
    emailBody = `Hi ${applicantName},\n\nThank you for applying for "${roleTitle}" at Olinethra. We have decided to move forward with other candidates at this time.\n\nBest regards,\nOlinethra Team`
  }

  if (emailBody) {
    sendEmail({ to: applicantEmail, subject, body: emailBody, templateName: "status_update" }).catch(console.error)
  }
}

export async function createInquiry(input: {
  name: string
  email: string
  company?: string
  projectType?: string
  budget?: string
  message: string
}) {
  const isHighPriority =
    (input.budget &&
      (input.budget.includes("15k") ||
        input.budget.includes("30k") ||
        input.budget.includes("40k") ||
        input.budget.includes("50k"))) ||
    input.message.length > 300

  const legacyId = generateLegacyId("inq")
  const inquiry = await Inquiry.create({
    legacyId,
    name: input.name,
    email: input.email,
    company: input.company || "N/A",
    projectType: input.projectType || "Web Application",
    budget: input.budget || "$5k - $15k",
    priority: isHighPriority ? "HIGH" : "MEDIUM",
    message: input.message,
    date: todayISO(),
    status: "New",
  })

  await Notification.create({
    legacyId: generateLegacyId("notif"),
    type: "inquiry",
    title: "New Project Inquiry Received",
    message: `${input.name} (${input.company || "Individual"}) submitted a ${input.projectType || "Web Application"} inquiry.`,
    date: new Date().toISOString(),
    read: false,
    link: "/admin/inquiries",
  })

  await logActivity({
    user: input.name,
    action: "Submitted Project Inquiry",
    entity: "Inquiry",
    resourceId: legacyId,
  })

  sendEmail({
    to: input.email,
    subject: "We've received your project inquiry — Olinethra",
    body: `Hi ${input.name},\n\nThank you for reaching out to Olinethra.\n\nWe have received your ${input.projectType || "Web Application"} project details. Our lead software engineer will review your scope and get back to you within 1 business day.\n\nBest regards,\nThe Olinethra Engineering Team`,
    templateName: "inquiry_confirmation",
  }).catch(console.error)

  return mapDoc(inquiry.toObject() as unknown as LeanDoc)
}

export async function createApplication(input: {
  applicantName: string
  email: string
  phone?: string
  opportunityTitle: string
  opportunityType: "Internship" | "Job"
  resumeUrl: string
  coverNote?: string
}) {
  const opportunityQuery = {
    title: input.opportunityTitle,
    status: "Open",
    deadline: { $gte: todayISO() },
  }
  const opportunity = input.opportunityType === "Internship"
    ? await Internship.findOne(opportunityQuery).lean()
    : await Job.findOne(opportunityQuery).lean()
  if (!opportunity) {
    throw new AppError(422, "OPPORTUNITY_UNAVAILABLE", "This opportunity is not open for applications.")
  }

  const legacyId = generateLegacyId("app")
  const application = await Application.create({
    legacyId,
    applicantName: input.applicantName,
    email: input.email,
    phone: input.phone || "",
    opportunityTitle: input.opportunityTitle,
    opportunityType: input.opportunityType,
    resumeUrl: input.resumeUrl,
    coverNote: input.coverNote,
    appliedDate: todayISO(),
    status: "New",
  })

  await Notification.create({
    legacyId: generateLegacyId("notif"),
    type: "application",
    title: "New Application Received",
    message: `${input.applicantName} applied for ${input.opportunityTitle}.`,
    date: new Date().toISOString(),
    read: false,
    link: "/admin/applications",
  })

  await logActivity({
    user: input.applicantName,
    action: "Submitted Application",
    entity: "Application",
    resourceId: legacyId,
  })

  sendEmail({
    to: input.email,
    subject: `Application Received — ${input.opportunityTitle}`,
    body: `Hi ${input.applicantName},\n\nWe have received your application for "${input.opportunityTitle}". Our team will review it shortly.\n\nBest regards,\nOlinethra Talent Team`,
    templateName: "application_confirmation",
  }).catch(console.error)

  return mapDoc(application.toObject() as unknown as LeanDoc)
}
