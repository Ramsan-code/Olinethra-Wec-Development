import type { Response } from "express"
import type { ApiErrorBody, ApiSuccess, PaginationMeta } from "../types/index.js"

export function sendSuccess<T>(
  res: Response,
  data?: T,
  options?: { message?: string; status?: number; pagination?: PaginationMeta }
) {
  const body: ApiSuccess<T> = { success: true }
  if (data !== undefined) body.data = data
  if (options?.message) body.message = options.message
  if (options?.pagination) body.pagination = options.pagination
  return res.status(options?.status ?? 200).json(body)
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown[]
) {
  const body: ApiErrorBody = {
    success: false,
    error: { code, message, details },
  }
  return res.status(status).json(body)
}
