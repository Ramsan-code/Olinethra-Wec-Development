import bcrypt from "bcryptjs"
import { User } from "../models/User.js"
import type { AuthUser } from "../types/index.js"
import { AppError } from "../middleware/error.middleware.js"
import { logActivity } from "./activity.service.js"

export async function authenticateAdmin(email: string, password: string): Promise<AuthUser> {
  const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select("+passwordHash")
  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials. Please try again.")
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid credentials. Please try again.")
  }

  await logActivity({
    user: user.name,
    action: "Admin Login",
    entity: "Auth",
    resourceId: user.legacyId,
  })

  return {
    id: user.legacyId,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function getAdminByLegacyId(legacyId: string): Promise<AuthUser | null> {
  const user = await User.findOne({ legacyId, isActive: true }).lean()
  if (!user) return null
  return { id: user.legacyId, name: user.name, email: user.email, role: user.role }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}
