import bcrypt from "bcryptjs"
import { User } from "../models/User.js"
import type { AuthUser } from "../types/index.js"
import { AppError } from "../middleware/error.middleware.js"
import { logActivity } from "./activity.service.js"
import { OAuth2Client } from "google-auth-library"
import { env } from "../config/env.js"
import crypto from "node:crypto"

const googleClient = new OAuth2Client()
const validRoles = new Set(["Super Admin", "Content Admin", "Hiring Admin"])

type GoogleAdminCandidate = {
  email: string
  isActive: boolean
  status: string
  role: string
  googleSubjectId?: string
}

export function googleAdminDenialReason(user: GoogleAdminCandidate | null, email: string, subject: string) {
  if (!user) return "not_authorized"
  if (user.email !== email || !user.isActive || user.status !== "ACTIVE" || !validRoles.has(user.role)) return "not_authorized"
  if (user.googleSubjectId && user.googleSubjectId !== subject) return "identity_mismatch"
  return null
}

function toAuthUser(user: { legacyId: string; name: string; email: string; role: AuthUser["role"]; authProvider?: "LOCAL" | "GOOGLE" }): AuthUser {
  return {
    id: user.legacyId,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function authenticateAdmin(email: string, password: string): Promise<AuthUser> {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash")
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.")
  }

  if (!user.isActive || user.status === "DISABLED") {
    throw new AppError(403, "ACCOUNT_DISABLED", "Your admin account is disabled. Please contact a Super Admin.")
  }

  if (user.status === "INVITED") {
    throw new AppError(403, "ACCOUNT_NOT_ACTIVATED", "Your admin account has not been activated yet. Please check your invitation email.")
  }

  if (!user.passwordHash) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.")
  }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password.")
  }

  user.lastLoginAt = new Date()
  await user.save()

  await logActivity({
    user: user.name,
    action: "ADMIN_LOGIN_SUCCESS",
    entity: "Auth",
    resourceId: user.legacyId,
  })

  return toAuthUser(user)
}

export async function authenticateGoogleAdmin(idToken: string, expectedNonce: string): Promise<AuthUser> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new AppError(503, "GOOGLE_AUTH_UNAVAILABLE", "Google sign-in is not configured.")
  }

  let payload
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID })
    payload = ticket.getPayload()
  } catch {
    throw new AppError(401, "GOOGLE_TOKEN_INVALID", "Google sign-in could not be verified.")
  }

  if (!payload?.sub || !payload.email || payload.email_verified !== true || !payload.nonce) {
    throw new AppError(401, "GOOGLE_IDENTITY_INVALID", "Google sign-in could not be verified.")
  }
  const actualNonce = Buffer.from(payload.nonce)
  const wantedNonce = Buffer.from(expectedNonce)
  if (actualNonce.length !== wantedNonce.length || !crypto.timingSafeEqual(actualNonce, wantedNonce)) {
    throw new AppError(401, "GOOGLE_NONCE_INVALID", "Google sign-in could not be verified.")
  }

  const normalizedEmail = payload.email.trim().toLowerCase()
  let user = await User.findOne({ googleSubjectId: payload.sub }).select("+googleSubjectId")
  if (!user) user = await User.findOne({ email: normalizedEmail }).select("+googleSubjectId")

  const denialReason = googleAdminDenialReason(user, normalizedEmail, payload.sub)
  if (denialReason) {
    await logActivity({ user: user?.name || "Google account", action: "ADMIN_GOOGLE_LOGIN_DENIED", entity: "Auth", resourceId: user?.legacyId, metadata: { reason: denialReason } })
    throw new AppError(403, "GOOGLE_ADMIN_UNAUTHORIZED", "This Google account is not authorized to access the Olinethra Admin Portal.")
  }

  if (!user) throw new AppError(403, "GOOGLE_ADMIN_UNAUTHORIZED", "This Google account is not authorized to access the Olinethra Admin Portal.")
  if (!user.googleSubjectId) {
    user.googleSubjectId = payload.sub
    user.authProvider = "GOOGLE"
    await logActivity({ user: user.name, action: "ADMIN_GOOGLE_IDENTITY_BOUND", entity: "Auth", resourceId: user.legacyId })
  }
  user.lastLoginAt = new Date()
  await user.save()
  await logActivity({ user: user.name, action: "ADMIN_GOOGLE_LOGIN_SUCCESS", entity: "Auth", resourceId: user.legacyId })
  return toAuthUser(user)
}

export async function getAdminByLegacyId(legacyId: string): Promise<AuthUser | null> {
  const user = await User.findOne({ legacyId, isActive: true, status: "ACTIVE" }).lean()
  if (!user) return null
  return toAuthUser(user)
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}
