import type { Request, Response, NextFunction } from "express"
import * as leadScoringService from "../services/leadScoring.service.js"
import { Lead } from "../models/Lead.js"
import { AppError } from "../middleware/error.middleware.js"

export async function getMlStatusHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const status = await leadScoringService.getMlSystemStatus()
    res.json({
      success: true,
      data: status,
    })
  } catch (error) {
    next(error)
  }
}

export async function scoreSingleLeadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const lead = await Lead.findOne({
      $or: [{ legacyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
    })

    if (!lead) {
      throw new AppError(404, "NOT_FOUND", "Lead record not found.")
    }

    const scored = await leadScoringService.scoreLead(lead)
    res.json({
      success: true,
      message: "Lead rescored successfully.",
      data: { lead: scored },
    })
  } catch (error) {
    next(error)
  }
}

export async function rescoreAllOpenLeadsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await leadScoringService.rescoreOpenLeads(req.user)
    res.json({
      success: true,
      message: `Rescored ${count} open leads successfully.`,
      data: { count },
    })
  } catch (error) {
    next(error)
  }
}

export async function triggerModelRetrainHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await leadScoringService.triggerDatasetExportAndTraining(req.user)
    res.json({
      success: true,
      message: result.message,
      data: { success: result.success },
    })
  } catch (error) {
    next(error)
  }
}
