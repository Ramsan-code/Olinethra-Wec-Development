import { AppError } from "../middleware/error.middleware.js"

export function generateLegacyId(prefix: string): string {
  return `${prefix}-${Date.now()}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function toPublicDoc<T extends { legacyId: string }>(doc: T): Omit<T, "legacyId"> & { id: string } {
  const { legacyId, ...rest } = doc as T & Record<string, unknown>
  return { ...rest, id: legacyId } as Omit<T, "legacyId"> & { id: string }
}

export function parsePagination(query: { page?: string; limit?: string }, maxLimit = 100) {
  const page = Math.max(1, parseInt(query.page || "1", 10) || 1)
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || "20", 10) || 20))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function paginationMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export function assertFound<T>(value: T | null | undefined, message = "Resource not found"): T {
  if (!value) throw new AppError(404, "NOT_FOUND", message)
  return value
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0]
}
