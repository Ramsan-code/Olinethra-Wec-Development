import type { Request, Response, NextFunction } from "express"
import {
  Project,
  TeamMember,
  Service,
  Faq,
  Internship,
  Job,
  SiteSettings,
} from "../models/index.js"
import { mapDoc } from "../services/cms.service.js"
import { sendSuccess } from "../utils/response.js"
import { AppError } from "../middleware/error.middleware.js"
import { todayISO } from "../utils/helpers.js"

export async function listProjects(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Project.find({ status: "Published" }).sort({ displayOrder: 1 }).lean()
    return sendSuccess(res, items.map(mapDoc))
  } catch (err) {
    next(err)
  }
}

export async function getProjectBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params
    const project = await Project.findOne({
      status: "Published",
      $or: [{ slug }, { legacyId: slug }],
    }).lean()
    if (!project) throw new AppError(404, "NOT_FOUND", "Project not found.")
    return sendSuccess(res, mapDoc(project))
  } catch (err) {
    next(err)
  }
}

export async function listTeam(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await TeamMember.find({ status: "Active" }).sort({ displayOrder: 1 }).lean()
    return sendSuccess(res, items.map(mapDoc).map(({ email, ...member }) => member))
  } catch (err) {
    next(err)
  }
}

export async function listServices(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Service.find({ status: "Active" }).sort({ displayOrder: 1 }).lean()
    return sendSuccess(res, items.map(mapDoc))
  } catch (err) {
    next(err)
  }
}

export async function listFaqs(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Faq.find({ published: true }).sort({ displayOrder: 1 }).lean()
    return sendSuccess(res, items.map(mapDoc))
  } catch (err) {
    next(err)
  }
}

export async function listInternships(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Internship.find({ status: "Open", deadline: { $gte: todayISO() } }).sort({ createdAt: -1 }).lean()
    return sendSuccess(res, items.map(mapDoc))
  } catch (err) {
    next(err)
  }
}

export async function listJobs(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await Job.find({ status: "Open", deadline: { $gte: todayISO() } }).sort({ createdAt: -1 }).lean()
    return sendSuccess(res, items.map(mapDoc))
  } catch (err) {
    next(err)
  }
}

export async function getSettings(_req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await SiteSettings.findOne({ key: "default" }).lean()
    if (!settings) return sendSuccess(res, {})
    const { key, _id, __v, ...rest } = settings as Record<string, unknown>
    return sendSuccess(res, rest)
  } catch (err) {
    next(err)
  }
}
