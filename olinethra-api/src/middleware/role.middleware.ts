import type { NextFunction, Request, Response } from "express"
import type { AdminRole } from "../types/index.js"
import { AppError } from "./error.middleware.js"

type Permission =
  | "projects"
  | "team"
  | "services"
  | "faqs"
  | "internships"
  | "jobs"
  | "applications"
  | "inquiries"
  | "media"
  | "settings"
  | "chatbot"
  | "notifications"
  | "analytics"
  | "users"
  | "insights"

const rolePermissions: Record<AdminRole, Permission[] | "*"> = {
  "Super Admin": "*",
  "Content Admin": [
    "projects",
    "team",
    "services",
    "faqs",
    "media",
    "chatbot",
    "notifications",
    "analytics",
    "insights",
  ],
  "Hiring Admin": ["internships", "jobs", "applications", "notifications", "analytics"],
}

export function requireRole(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "UNAUTHORIZED", "Unauthorized access."))
    }

    const allowed = rolePermissions[req.user.role]
    if (allowed === "*") return next()

    const hasPermission = permissions.some((p) => allowed.includes(p))
    if (!hasPermission) {
      return next(new AppError(403, "FORBIDDEN", "Insufficient permissions."))
    }

    next()
  }
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "Super Admin") {
    return next(new AppError(403, "FORBIDDEN", "Super Admin access required."))
  }
  next()
}
