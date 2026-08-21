import type { Request, Response, NextFunction } from "express"
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE_NAME } from "../middleware/auth.middleware.js"
import { authenticateAdmin, getAdminByLegacyId } from "../services/auth.service.js"
import { sendSuccess } from "../utils/response.js"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import { AppError } from "../middleware/error.middleware.js"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await authenticateAdmin(email, password)
    setAuthCookies(res, user)
    return res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

export function logout(_req: Request, res: Response) {
  clearAuthCookies(res)
  return res.json({ success: true })
}

export function me(req: Request, res: Response) {
  return sendSuccess(res, { user: req.user })
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME]
    if (!token) throw new AppError(401, "UNAUTHORIZED", "Refresh session is missing.")
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string }
    const user = await getAdminByLegacyId(payload.sub)
    if (!user) throw new AppError(401, "UNAUTHORIZED", "Refresh session is invalid.")
    setAuthCookies(res, user)
    return sendSuccess(res, { user })
  } catch (error) {
    if (error instanceof AppError) return next(error)
    return next(new AppError(401, "UNAUTHORIZED", "Refresh session is invalid."))
  }
}
