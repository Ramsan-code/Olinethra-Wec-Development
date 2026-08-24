import type { Request, Response, NextFunction } from "express"
import {
  listPublicInsights,
  getPublicInsightBySlug,
  getCategories,
  createCategory,
  listAdminInsights,
  getAdminInsightById,
  createInsightPost,
  updateInsightPost,
  publishInsightPost,
  unpublishInsightPost,
  archiveInsightPost,
  deleteInsightPost,
  trackInsightCtaClick,
} from "../services/insights.service.js"
import {
  generateInsightDraft,
  generateTechBriefFromSource,
  aiAssistSection,
} from "../services/ai/insightsAi.service.js"
import { AppError } from "../middleware/error.middleware.js"

export async function listPublicInsightsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listPublicInsights({
      page: req.query.page as string,
      limit: req.query.limit as string,
      category: req.query.category as string,
      tag: req.query.tag as string,
      type: req.query.type as string,
      audience: req.query.audience as string,
      search: req.query.search as string,
    })
    res.json({ success: true, data: result.posts, pagination: result.meta })
  } catch (err) {
    next(err)
  }
}

export async function getPublicInsightBySlugHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params
    const result = await getPublicInsightBySlug(slug)
    res.json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function getCategoriesHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await getCategories()
    res.json({ success: true, data: categories })
  } catch (err) {
    next(err)
  }
}

export async function trackCtaClickHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    await trackInsightCtaClick(id)
    res.json({ success: true, message: "CTA click recorded." })
  } catch (err) {
    next(err)
  }
}

export async function listAdminInsightsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await listAdminInsights({
      page: req.query.page as string,
      limit: req.query.limit as string,
      status: req.query.status as string,
      type: req.query.type as string,
      category: req.query.category as string,
      authorship: req.query.authorship as string,
      audience: req.query.audience as string,
      search: req.query.search as string,
    })
    res.json({ success: true, data: result.posts, pagination: result.meta })
  } catch (err) {
    next(err)
  }
}

export async function getAdminInsightByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const post = await getAdminInsightById(id)
    res.json({ success: true, data: post })
  } catch (err) {
    next(err)
  }
}

export async function createInsightHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const post = await createInsightPost(req.user, req.body)
    res.status(201).json({ success: true, data: post, message: "Insight post created as DRAFT." })
  } catch (err) {
    next(err)
  }
}

export async function updateInsightHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const { id } = req.params
    const post = await updateInsightPost(req.user, id, req.body)
    res.json({ success: true, data: post, message: "Insight post updated successfully." })
  } catch (err) {
    next(err)
  }
}

export async function publishInsightHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const { id } = req.params
    const post = await publishInsightPost(req.user, id)
    res.json({ success: true, data: post, message: "Insight post published successfully." })
  } catch (err) {
    next(err)
  }
}

export async function unpublishInsightHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const { id } = req.params
    const post = await unpublishInsightPost(req.user, id)
    res.json({ success: true, data: post, message: "Insight post unpublished to DRAFT." })
  } catch (err) {
    next(err)
  }
}

export async function archiveInsightHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const { id } = req.params
    const post = await archiveInsightPost(req.user, id)
    res.json({ success: true, data: post, message: "Insight post archived." })
  } catch (err) {
    next(err)
  }
}

export async function deleteInsightHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const { id } = req.params
    await deleteInsightPost(req.user, id)
    res.json({ success: true, message: "Insight post deleted successfully." })
  } catch (err) {
    next(err)
  }
}

export async function createCategoryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, displayOrder } = req.body
    if (!name) throw new AppError(400, "MISSING_NAME", "Category name is required.")
    const category = await createCategory(name, description, displayOrder)
    res.status(201).json({ success: true, data: category })
  } catch (err) {
    next(err)
  }
}

export async function generateDraftHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const result = await generateInsightDraft(req.body)
    res.json({ success: true, data: result, message: "AI article draft generated. Pending human review." })
  } catch (err) {
    next(err)
  }
}

export async function generateTechBriefHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const result = await generateTechBriefFromSource(req.body)
    res.json({ success: true, data: result, message: "AI Tech Brief generated. Pending human review." })
  } catch (err) {
    next(err)
  }
}

export async function aiAssistHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    const resultText = await aiAssistSection(req.body)
    res.json({ success: true, data: { result: resultText } })
  } catch (err) {
    next(err)
  }
}
