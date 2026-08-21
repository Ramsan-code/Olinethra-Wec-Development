import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { isProduction } from "../config/env.js"
import { sendError } from "../utils/response.js"

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown[]
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function notFoundHandler(_req: Request, res: Response) {
  return sendError(res, 404, "NOT_FOUND", "Route not found")
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (isAppError(err)) {
    return sendError(res, err.statusCode, err.code, err.message, err.details)
  }

  if (err instanceof ZodError) {
    return sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Invalid request data",
      err.errors.map((e) => ({ path: e.path.join("."), message: e.message }))
    )
  }

  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    return sendError(res, 400, "MALFORMED_JSON", "Request body contains malformed JSON.")
  }

  if (err instanceof Error && err.message === "Not allowed by CORS") {
    return sendError(res, 403, "CORS_ERROR", "Origin not allowed")
  }

  if (!isProduction) {
    console.error("[ERROR]", err)
  }

  return sendError(res, 500, "INTERNAL_ERROR", "Internal server error")
}
