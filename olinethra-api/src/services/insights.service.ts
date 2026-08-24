import { InsightCategory, InsightPost, IInsightPost } from "../models/index.js"
import { generateLegacyId, slugify, parsePagination, paginationMeta, assertFound } from "../utils/helpers.js"
import { AppError } from "../middleware/error.middleware.js"
import { logActivity } from "./activity.service.js"
import { deleteFromCloudinary } from "./cloudinary.service.js"
import type { AuthUser } from "../types/index.js"

export const DEFAULT_CATEGORIES = [
  { name: "Engineering", description: "Deep dives into system design, software craft, and performance.", displayOrder: 1 },
  { name: "AI & Automation", description: "Practical application of LLMs, agentic workflows, and machine learning.", displayOrder: 2 },
  { name: "Web Development", description: "Next.js, React, modern web standards, and UI architecture.", displayOrder: 3 },
  { name: "Cybersecurity", description: "Application security, identity management, and threat prevention.", displayOrder: 4 },
  { name: "Business Technology", description: "Digital transformation, tech strategy, and building software products.", displayOrder: 5 },
  { name: "Cloud & Infrastructure", description: "DevOps, database optimization, serverless, and cloud engineering.", displayOrder: 6 },
  { name: "Careers & Internships", description: "Insights for engineers, career growth, and Olinethra's culture.", displayOrder: 7 },
  { name: "Olinethra", description: "Company announcements, engineering milestones, and updates.", displayOrder: 8 },
]

export async function ensureDefaultCategories() {
  const count = await InsightCategory.countDocuments()
  if (count === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await InsightCategory.create({
        legacyId: generateLegacyId("cat"),
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
        displayOrder: cat.displayOrder,
        isDefault: true,
      })
    }
  }
}

export async function getCategories() {
  await ensureDefaultCategories()
  const categories = await InsightCategory.find().sort({ displayOrder: 1, name: 1 }).lean()
  return categories.map((c: any) => ({
    id: c.legacyId,
    _id: c._id?.toString(),
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    displayOrder: c.displayOrder,
  }))
}

export async function createCategory(name: string, description?: string, displayOrder = 0) {
  const slug = slugify(name)
  const existing = await InsightCategory.findOne({ $or: [{ name }, { slug }] })
  if (existing) {
    throw new AppError(400, "CATEGORY_EXISTS", "A category with this name or slug already exists.")
  }

  const legacyId = generateLegacyId("cat")
  const category = await InsightCategory.create({
    legacyId,
    name,
    slug,
    description: description || "",
    displayOrder,
  })
  return {
    id: category.legacyId,
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    displayOrder: category.displayOrder,
  }
}

export function calculateReadingTime(text: string): number {
  if (!text) return 1
  const cleanText = text.replace(/<[^>]*>/g, "").replace(/[#*`_\[\]]/g, "")
  const words = cleanText.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function formatDoc(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc
  const { legacyId, _id, __v, ...rest } = obj
  return {
    ...rest,
    id: legacyId || _id?.toString(),
    _id: _id?.toString(),
  }
}

export async function listPublicInsights(query: {
  page?: string
  limit?: string
  category?: string
  tag?: string
  type?: string
  audience?: string
  search?: string
}) {
  await ensureDefaultCategories()
  const { page, limit, skip } = parsePagination(query)

  const filter: Record<string, any> = { status: "PUBLISHED" }

  if (query.type) {
    filter.type = query.type.toUpperCase()
  }

  if (query.audience) {
    filter.audience = { $in: [query.audience.toUpperCase(), "BOTH"] }
  }

  if (query.tag) {
    filter.tags = { $in: [query.tag] }
  }

  if (query.category) {
    // Can be category slug or category ID
    const cat: any = await InsightCategory.findOne({
      $or: [{ slug: query.category.toLowerCase() }, { legacyId: query.category }],
    }).lean().exec()
    if (cat) {
      filter.category = cat._id
    }
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search.trim(), "i")
    filter.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { tags: searchRegex },
      { content: searchRegex },
    ]
  }

  const [posts, total] = await Promise.all([
    InsightPost.find(filter)
      .populate("category", "name slug")
      .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    InsightPost.countDocuments(filter),
  ])

  const formattedPosts = posts.map((p) => formatDoc(p))

  return {
    posts: formattedPosts,
    meta: paginationMeta(page, limit, total),
  }
}

export async function getPublicInsightBySlug(slug: string) {
  const post = await InsightPost.findOne({ slug: slug.toLowerCase(), status: "PUBLISHED" })
    .populate("category", "name slug")
    .exec()

  if (!post) {
    throw new AppError(404, "NOT_FOUND", "Insight article not found.")
  }

  // Increment views
  post.views = (post.views || 0) + 1
  await post.save()

  // Fetch related published insights (same category or tags)
  const related = await InsightPost.find({
    status: "PUBLISHED",
    _id: { $ne: post._id },
    $or: [{ category: post.category }, { tags: { $in: post.tags } }],
  })
    .populate("category", "name slug")
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean()

  return {
    post: formatDoc(post),
    related: related.map((r) => formatDoc(r)),
  }
}

export async function listAdminInsights(query: {
  page?: string
  limit?: string
  status?: string
  type?: string
  category?: string
  authorship?: string
  audience?: string
  search?: string
}) {
  await ensureDefaultCategories()
  const { page, limit, skip } = parsePagination(query)
  const filter: Record<string, any> = {}

  if (query.status) {
    filter.status = query.status.toUpperCase()
  }

  if (query.type) {
    filter.type = query.type.toUpperCase()
  }

  if (query.authorship) {
    filter.authorship = query.authorship.toUpperCase()
  }

  if (query.audience) {
    filter.audience = query.audience.toUpperCase()
  }

  if (query.category) {
    const cat: any = await InsightCategory.findOne({
      $or: [{ slug: query.category.toLowerCase() }, { legacyId: query.category }],
    }).lean().exec()
    if (cat) filter.category = cat._id
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search.trim(), "i")
    filter.$or = [
      { title: searchRegex },
      { slug: searchRegex },
      { excerpt: searchRegex },
      { tags: searchRegex },
    ]
  }

  const [posts, total] = await Promise.all([
    InsightPost.find(filter)
      .populate("category", "name slug")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    InsightPost.countDocuments(filter),
  ])

  return {
    posts: posts.map((p) => formatDoc(p)),
    meta: paginationMeta(page, limit, total),
  }
}

export async function getAdminInsightById(id: string) {
  const post = await InsightPost.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  })
    .populate("category", "name slug")
    .lean()

  if (!post) {
    throw new AppError(404, "NOT_FOUND", "Insight post not found.")
  }

  return formatDoc(post)
}

export async function createInsightPost(admin: AuthUser, input: any) {
  await ensureDefaultCategories()
  if (!input.title || !input.excerpt) {
    throw new AppError(400, "MISSING_FIELDS", "Title and excerpt are required.")
  }

  let categoryId = input.category
  let categoryName = "Engineering"

  if (categoryId) {
    const cat: any = await InsightCategory.findOne({
      $or: [{ legacyId: categoryId }, { _id: categoryId.match?.(/^[0-9a-fA-F]{24}$/) ? categoryId : null }],
    }).lean().exec()
    if (cat) {
      categoryId = cat._id
      categoryName = cat.name
    } else {
      const defaultCat: any = await InsightCategory.findOne().lean().exec()
      categoryId = defaultCat?._id
      categoryName = defaultCat?.name || "Engineering"
    }
  } else {
    const defaultCat: any = await InsightCategory.findOne().lean().exec()
    categoryId = defaultCat?._id
    categoryName = defaultCat?.name || "Engineering"
  }

  const titleSlug = slugify(input.title)
  let finalSlug = input.slug ? slugify(input.slug) : titleSlug
  let slugCount = 0
  while (await InsightPost.findOne({ slug: slugCount === 0 ? finalSlug : `${finalSlug}-${slugCount}` })) {
    slugCount++
  }
  if (slugCount > 0) finalSlug = `${finalSlug}-${slugCount}`

  const readingTime = calculateReadingTime(input.content || "")
  const legacyId = generateLegacyId("insight")

  const post = await InsightPost.create({
    legacyId,
    title: input.title,
    slug: finalSlug,
    excerpt: input.excerpt,
    content: input.content || "",
    type: input.type === "TECH_BRIEF" ? "TECH_BRIEF" : "ARTICLE",
    authorship: input.authorship || "HUMAN",
    authorName: input.authorName || admin.name || "Olinethra Team",
    authorRole: input.authorRole || "Engineering Studio",
    authorAvatar: input.authorAvatar || "",
    ai: input.ai || undefined,
    category: categoryId,
    categoryName,
    tags: Array.isArray(input.tags) ? input.tags : [],
    audience: ["CLIENTS", "DEVELOPERS", "BOTH"].includes(input.audience) ? input.audience : "BOTH",
    coverImage: input.coverImage || undefined,
    status: ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"].includes(input.status) ? input.status : "DRAFT",
    featured: Boolean(input.featured),
    readingTimeMinutes: readingTime,
    source: input.source || undefined,
    seo: {
      title: input.seo?.title || input.title,
      description: input.seo?.description || input.excerpt,
      canonicalUrl: input.seo?.canonicalUrl || `/insights/${finalSlug}`,
    },
    publishedAt: input.status === "PUBLISHED" ? new Date() : undefined,
    createdBy: admin.id || admin.name,
    updatedBy: admin.id || admin.name,
  })

  await logActivity({
    user: admin.name,
    action: `Created Insight post (${post.type}): "${post.title}"`,
    entity: "InsightPost",
    resourceId: legacyId,
  })

  return formatDoc(post)
}

export async function updateInsightPost(admin: AuthUser, id: string, input: any) {
  const post = await InsightPost.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  })

  if (!post) throw new AppError(404, "NOT_FOUND", "Insight post not found.")

  if (input.title) post.title = input.title

  if (input.slug && input.slug !== post.slug) {
    const newSlug = slugify(input.slug)
    const slugExists = await InsightPost.findOne({ slug: newSlug, _id: { $ne: post._id } })
    if (!slugExists) {
      post.slug = newSlug
    }
  }

  if (input.excerpt !== undefined) post.excerpt = input.excerpt
  if (input.content !== undefined) {
    post.content = input.content
    post.readingTimeMinutes = calculateReadingTime(input.content)
  }

  if (input.type) post.type = input.type
  if (input.authorship) post.authorship = input.authorship
  if (input.authorName) post.authorName = input.authorName
  if (input.authorRole) post.authorRole = input.authorRole
  if (input.authorAvatar !== undefined) post.authorAvatar = input.authorAvatar
  if (input.ai) post.ai = { ...post.ai, ...input.ai }

  if (input.category) {
    const cat: any = await InsightCategory.findOne({
      $or: [{ legacyId: input.category }, { _id: input.category.match?.(/^[0-9a-fA-F]{24}$/) ? input.category : null }],
    }).lean().exec()
    if (cat) {
      post.category = cat._id as any
      post.categoryName = cat.name
    }
  }

  if (Array.isArray(input.tags)) post.tags = input.tags
  if (input.audience) post.audience = input.audience
  if (input.coverImage) post.coverImage = input.coverImage
  if (input.featured !== undefined) post.featured = Boolean(input.featured)
  if (input.source) post.source = input.source

  if (input.seo) {
    post.seo = { ...post.seo, ...input.seo }
  }

  post.updatedBy = admin.id || admin.name
  await post.save()

  await logActivity({
    user: admin.name,
    action: `Updated Insight post: "${post.title}"`,
    entity: "InsightPost",
    resourceId: post.legacyId,
  })

  return formatDoc(post)
}

export async function publishInsightPost(admin: AuthUser, id: string) {
  const post = await InsightPost.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  })

  if (!post) throw new AppError(404, "NOT_FOUND", "Insight post not found.")

  post.status = "PUBLISHED"
  if (!post.publishedAt) {
    post.publishedAt = new Date()
  }
  post.updatedBy = admin.id || admin.name
  await post.save()

  await logActivity({
    user: admin.name,
    action: `Published Insight post: "${post.title}"`,
    entity: "InsightPost",
    resourceId: post.legacyId,
  })

  return formatDoc(post)
}

export async function unpublishInsightPost(admin: AuthUser, id: string) {
  const post = await InsightPost.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  })

  if (!post) throw new AppError(404, "NOT_FOUND", "Insight post not found.")

  post.status = "DRAFT"
  post.updatedBy = admin.id || admin.name
  await post.save()

  await logActivity({
    user: admin.name,
    action: `Unpublished Insight post: "${post.title}"`,
    entity: "InsightPost",
    resourceId: post.legacyId,
  })

  return formatDoc(post)
}

export async function archiveInsightPost(admin: AuthUser, id: string) {
  const post = await InsightPost.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  })

  if (!post) throw new AppError(404, "NOT_FOUND", "Insight post not found.")

  post.status = "ARCHIVED"
  post.updatedBy = admin.id || admin.name
  await post.save()

  await logActivity({
    user: admin.name,
    action: `Archived Insight post: "${post.title}"`,
    entity: "InsightPost",
    resourceId: post.legacyId,
  })

  return formatDoc(post)
}

export async function deleteInsightPost(admin: AuthUser, id: string) {
  const post = await InsightPost.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  })

  if (!post) throw new AppError(404, "NOT_FOUND", "Insight post not found.")

  if (post.coverImage?.publicId) {
    await deleteFromCloudinary(post.coverImage.publicId).catch(() => null)
  }

  await InsightPost.deleteOne({ _id: post._id })

  await logActivity({
    user: admin.name,
    action: `Deleted Insight post: "${post.title}"`,
    entity: "InsightPost",
    resourceId: post.legacyId,
  })

  return { success: true }
}

export async function trackInsightCtaClick(id: string) {
  const post = await InsightPost.findOne({
    $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  })
  if (post) {
    post.ctaClicks = (post.ctaClicks || 0) + 1
    await post.save()
  }
}
