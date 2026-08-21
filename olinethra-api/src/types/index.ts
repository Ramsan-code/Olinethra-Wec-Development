export type AdminRole = "Super Admin" | "Content Admin" | "Hiring Admin"

export interface ApiSuccess<T = unknown> {
  success: true
  data?: T
  message?: string
  pagination?: PaginationMeta
}

export interface ApiErrorBody {
  success: false
  error: {
    code: string
    message: string
    details?: unknown[]
  }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: AdminRole
}

export interface CmsExport {
  team: Record<string, unknown>[]
  internships: Record<string, unknown>[]
  jobs: Record<string, unknown>[]
  projects: Record<string, unknown>[]
  services: Record<string, unknown>[]
  faqs: Record<string, unknown>[]
  chatbotKnowledge: Record<string, unknown>[]
  siteSettings: Record<string, unknown>
  applications: Record<string, unknown>[]
  inquiries: Record<string, unknown>[]
  notifications: Record<string, unknown>[]
  activityLog: Record<string, unknown>[]
}
