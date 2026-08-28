import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
import { env } from "../config/env.js"
import type { AuthUser } from "../types/index.js"
import { AppError } from "./error.middleware.js"
import crypto from "node:crypto"
import { User } from "../models/User.js"

export const SESSION_COOKIE_NAME = "olinethra_admin_session"
export const REFRESH_COOKIE_NAME = "olinethra_admin_refresh"

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

interface TokenPayload {
  sub: string
  name: string
  email: string
  role: AuthUser["role"]
}

interface RefreshTokenPayload {
  sub: string
  jti: string
}

export function signAccessToken(user: AuthUser): string {
  return jwt.sign(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions["expiresIn"] }
  )
}

export function signRefreshToken(user: AuthUser, jti: string): string {
  return jwt.sign({ sub: user.id, jti }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as jwt.SignOptions["expiresIn"],
  })
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload
}

export async function setAuthCookies(res: Response, user: AuthUser) {
  const accessToken = signAccessToken(user)
  const jti = crypto.randomBytes(32).toString("base64url")
  const refreshToken = signRefreshToken(user, jti)
  await User.updateOne({ legacyId: user.id }, { $set: { refreshTokenHash: hashRefreshTokenId(jti) } })

  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  }

  res.cookie(SESSION_COOKIE_NAME, accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  })

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload
}

export function hashRefreshTokenId(jti: string) {
  return crypto.createHash("sha256").update(jti).digest("hex")
}

export function refreshTokenMatches(actualHash: string, expectedHash: string) {
  const actual = Buffer.from(actualHash)
  const expected = Buffer.from(expectedHash)
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" })
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/" })
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token =
      req.cookies?.[SESSION_COOKIE_NAME] ||
      req.headers.authorization?.replace(/^Bearer\s+/i, "")

    if (!token) {
      throw new AppError(401, "UNAUTHORIZED", "Unauthorized access.")
    }

    const payload = verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    }
    next()
  } catch {
    next(new AppError(401, "UNAUTHORIZED", "Unauthorized access."))
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[SESSION_COOKIE_NAME]
    if (token) {
      const payload = verifyAccessToken(token)
      req.user = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      }
    }
  } catch {
    // ignore invalid token
  }
  next()
}
