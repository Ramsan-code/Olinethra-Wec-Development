import type { Request, Response, NextFunction } from "express"
import { User } from "../models/User.js"
import { hashPassword } from "../services/auth.service.js"
import { sendSuccess } from "../utils/response.js"
import { AppError } from "../middleware/error.middleware.js"
import { logActivity } from "../services/activity.service.js"
import crypto from "crypto"
import { z } from "zod"

const inviteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Valid email required."),
  role: z.enum(["Super Admin", "Content Admin", "Hiring Admin"]),
})

const activateSchema = z.object({
  token: z.string().min(1, "Activation token required."),
  password: z.string().min(12, "Password must be at least 12 characters."),
})

const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email required."),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token required."),
  password: z.string().min(12, "Password must be at least 12 characters."),
})

// GET /api/v1/users (Super Admin only)
export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find()
      .select("-passwordHash -inviteToken -resetToken")
      .sort({ createdAt: -1 })
      .lean()

    return sendSuccess(res, { users })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/users/invite (Super Admin only)
export async function inviteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, role } = inviteSchema.parse(req.body)
    const normalizedEmail = email.toLowerCase()

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      throw new AppError(400, "USER_EXISTS", "An administrator with this email address already exists.")
    }

    const legacyId = `usr_${Date.now()}`

    const user = new User({
      legacyId,
      name,
      email: normalizedEmail,
      role,
      isActive: true,
      status: "ACTIVE",
      authProvider: "GOOGLE",
      createdBy: req.user?.id,
    })

    await user.save()

    await logActivity({
      user: req.user?.name || "System",
      action: "ADMIN_CREATED",
      entity: "Auth",
      resourceId: user.legacyId,
    })

    return sendSuccess(
      res,
      {
        message: "Google administrator authorized successfully.",
        user: {
          id: user.legacyId,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/auth/activate (Public flow for invited admin)
export async function activateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = activateSchema.parse(req.body)

    const user = await User.findOne({
      inviteToken: token,
      inviteTokenExpires: { $gt: new Date() },
    }).select("+passwordHash +inviteToken")

    if (!user) {
      throw new AppError(400, "INVALID_TOKEN", "Invitation token is invalid or has expired. Please ask a Super Admin to resend an invite.")
    }

    user.passwordHash = await hashPassword(password)
    user.authProvider = "LOCAL"
    user.status = "ACTIVE"
    user.isActive = true
    user.inviteToken = undefined
    user.inviteTokenExpires = undefined
    user.lastLoginAt = new Date()

    await user.save()

    await logActivity({
      user: user.name,
      action: "ADMIN_ACTIVATED",
      entity: "Auth",
      resourceId: user.legacyId,
    })

    return sendSuccess(res, { message: "Account activated successfully. You can now sign in to the Admin Portal." })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/auth/forgot-password (Public)
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body)
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true, status: "ACTIVE" })

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex")
      user.resetToken = resetToken
      user.resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour
      await user.save()

      await logActivity({
        user: user.name,
        action: "ADMIN_PASSWORD_RESET_REQUESTED",
        entity: "Auth",
        resourceId: user.legacyId,
      })
    }

    // Generic response to prevent user enumeration
    return sendSuccess(res, {
      message: "If an active admin account exists for that email, password reset instructions have been generated.",
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/v1/auth/reset-password (Public)
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body)

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    }).select("+passwordHash +resetToken")

    if (!user) {
      throw new AppError(400, "INVALID_TOKEN", "Password reset token is invalid or has expired. Please request a new password reset.")
    }

    user.passwordHash = await hashPassword(password)
    user.resetToken = undefined
    user.resetTokenExpires = undefined
    await user.save()

    await logActivity({
      user: user.name,
      action: "ADMIN_PASSWORD_RESET_SUCCESS",
      entity: "Auth",
      resourceId: user.legacyId,
    })

    return sendSuccess(res, { message: "Password updated successfully. Please sign in with your new credentials." })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/v1/users/:id/status (Super Admin only)
export async function updateUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["ACTIVE", "DISABLED"].includes(status)) {
      throw new AppError(400, "INVALID_STATUS", "Status must be ACTIVE or DISABLED.")
    }

    const targetUser = await User.findOne({ legacyId: id })
    if (!targetUser) {
      throw new AppError(404, "NOT_FOUND", "Admin user not found.")
    }

    // Prevent disabling the LAST active Super Admin
    if (status === "DISABLED" && targetUser.role === "Super Admin") {
      const activeSuperAdmins = await User.countDocuments({ role: "Super Admin", status: "ACTIVE" })
      if (activeSuperAdmins <= 1) {
        throw new AppError(400, "LAST_SUPER_ADMIN", "Cannot disable the only active Super Admin account.")
      }
    }

    targetUser.status = status as "ACTIVE" | "DISABLED"
    targetUser.isActive = status === "ACTIVE"
    await targetUser.save()

    await logActivity({
      user: req.user?.name || "Super Admin",
      action: status === "DISABLED" ? "ADMIN_DISABLED" : "ADMIN_ENABLED",
      entity: "Auth",
      resourceId: targetUser.legacyId,
    })

    return sendSuccess(res, { message: `User status updated to ${status}.`, user: targetUser })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/v1/users/:id/role (Super Admin only)
export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!["Super Admin", "Content Admin", "Hiring Admin"].includes(role)) {
      throw new AppError(400, "INVALID_ROLE", "Role must be Super Admin, Content Admin, or Hiring Admin.")
    }

    const targetUser = await User.findOne({ legacyId: id })
    if (!targetUser) {
      throw new AppError(404, "NOT_FOUND", "Admin user not found.")
    }

    // Prevent demoting the LAST Super Admin
    if (targetUser.role === "Super Admin" && role !== "Super Admin") {
      const activeSuperAdmins = await User.countDocuments({ role: "Super Admin", status: "ACTIVE" })
      if (activeSuperAdmins <= 1) {
        throw new AppError(400, "LAST_SUPER_ADMIN", "Cannot change role of the only active Super Admin account.")
      }
    }

    targetUser.role = role
    await targetUser.save()

    await logActivity({
      user: req.user?.name || "Super Admin",
      action: "ADMIN_ROLE_CHANGED",
      entity: "Auth",
      resourceId: targetUser.legacyId,
    })

    return sendSuccess(res, { message: `User role updated to ${role}.`, user: targetUser })
  } catch (err) {
    next(err)
  }
}
