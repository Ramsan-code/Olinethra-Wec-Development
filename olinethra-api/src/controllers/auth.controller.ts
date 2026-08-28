import type { Request, Response, NextFunction } from "express"
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE_NAME, hashRefreshTokenId, refreshTokenMatches, verifyRefreshToken } from "../middleware/auth.middleware.js"
import { authenticateAdmin, authenticateGoogleAdmin, getAdminByLegacyId } from "../services/auth.service.js"
import { sendSuccess } from "../utils/response.js"
import { z } from "zod"
import { AppError } from "../middleware/error.middleware.js"
import { User } from "../models/User.js"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const googleLoginSchema = z.object({
  idToken: z.string().min(1),
  nonce: z.string().min(32).max(256),
})

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await authenticateAdmin(email, password)
    await setAuthCookies(res, user)
    return res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { idToken, nonce } = googleLoginSchema.parse(req.body)
    const user = await authenticateGoogleAdmin(idToken, nonce)
    await setAuthCookies(res, user)
    return res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME]
  if (token) {
    try {
      const payload = verifyRefreshToken(token)
      await User.updateOne({ legacyId: payload.sub }, { $unset: { refreshTokenHash: 1 } })
    } catch {
      // Always clear cookies, including malformed or expired sessions.
    }
  }
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
    const payload = verifyRefreshToken(token)
    if (!payload.jti) throw new AppError(401, "UNAUTHORIZED", "Refresh session is invalid.")
    const record = await User.findOne({ legacyId: payload.sub, isActive: true, status: "ACTIVE" }).select("+refreshTokenHash")
    if (!record?.refreshTokenHash || !refreshTokenMatches(hashRefreshTokenId(payload.jti), record.refreshTokenHash)) {
      throw new AppError(401, "UNAUTHORIZED", "Refresh session is invalid.")
    }
    const user = await getAdminByLegacyId(payload.sub)
    if (!user) throw new AppError(401, "UNAUTHORIZED", "Refresh session is invalid.")
    await setAuthCookies(res, user)
    return sendSuccess(res, { user })
  } catch (error) {
    if (error instanceof AppError) return next(error)
    return next(new AppError(401, "UNAUTHORIZED", "Refresh session is invalid."))
  }
}
