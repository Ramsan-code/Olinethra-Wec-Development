import type { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { createInquiry } from "../services/cms.service.js"

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(160).optional(),
  projectType: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(80).optional(),
  message: z.string().trim().min(1).max(10000),
}).strict()

export async function submitInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const input = inquirySchema.parse(req.body)
    const inquiry = await createInquiry(input)
    return res.json({ success: true, inquiry })
  } catch (err) {
    next(err)
  }
}
