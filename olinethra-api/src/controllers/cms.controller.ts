import type { Request, Response, NextFunction } from "express"
import { buildCmsExport, handleLegacyCmsAction } from "../services/cms.service.js"
import { AppError } from "../middleware/error.middleware.js"

export async function getCms(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    }
    const cms = await buildCmsExport()
    return res.json(cms)
  } catch (err) {
    next(err)
  }
}

export async function postCms(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    }
    const result = await handleLegacyCmsAction(req.user, req.body)
    return res.json(result)
  } catch (err) {
    next(err)
  }
}

// Public CMS subset for backward-compatible public reads (filtered)
export async function getPublicCms(_req: Request, res: Response, next: NextFunction) {
  try {
    const cms = await buildCmsExport()
    return res.json({
      team: cms.team.filter((t) => t.status === "Active").map(({ email, ...member }) => member),
      internships: cms.internships.filter((i) => i.status === "Open"),
      jobs: cms.jobs.filter((j) => j.status === "Open"),
      projects: cms.projects.filter((p) => p.status === "Published"),
      services: cms.services.filter((s) => s.status === "Active"),
      faqs: cms.faqs.filter((f) => f.published),
      siteSettings: cms.siteSettings,
    })
  } catch (err) {
    next(err)
  }
}
