import type { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { createApplication } from "../services/cms.service.js"
import { sendSuccess } from "../utils/response.js"

const applicationSchema = z.object({
  applicantName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional(),
  opportunityTitle: z.string().trim().min(1).max(160),
  opportunityType: z.enum(["Internship", "Job"]),
  resumeUrl: z.string().url().max(2048),
  coverNote: z.string().trim().max(5000).optional(),
}).strict()

export async function submitApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const input = applicationSchema.parse(req.body)
    const application = await createApplication(input)
    return sendSuccess(res, application, {
      status: 201,
      message: "Application submitted successfully.",
    })
  } catch (err) {
    next(err)
  }
}
