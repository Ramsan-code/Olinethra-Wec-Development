import { Router } from "express"
import { login, logout, me, refresh } from "../controllers/auth.controller.js"
import { submitApplication } from "../controllers/application.controller.js"
import { chat } from "../controllers/chat.controller.js"
import { getCms, getPublicCms, postCms } from "../controllers/cms.controller.js"
import { health } from "../controllers/health.controller.js"
import { submitInquiry } from "../controllers/inquiry.controller.js"
import {
  getProjectBySlug,
  getSettings,
  listFaqs,
  listInternships,
  listJobs,
  listProjects,
  listServices,
  listTeam,
} from "../controllers/public.controller.js"
import { requireAuth } from "../middleware/auth.middleware.js"
import { requireRole } from "../middleware/role.middleware.js"
import { authLimiter, chatLimiter, formLimiter, aiGenLimiter } from "../middleware/rateLimit.middleware.js"

import {
  verifyWebhook,
  handleWebhook,
  listConversations,
  getConversation,
  sendMessage,
  takeoverConversation,
  resumeAi,
  updateLead,
} from "../controllers/whatsapp.controller.js"

import {
  listUsers,
  inviteUser,
  activateUser,
  forgotPassword,
  resetPassword,
  updateUserStatus,
  updateUserRole,
} from "../controllers/user.controller.js"

import {
  uploadQuote,
  listQuotes,
  getQuote,
  updateQuote,
  deleteQuote,
  viewQuotePdf,
  downloadQuotePdf,
} from "../controllers/quote.controller.js"
import { upload } from "../middleware/upload.middleware.js"

import {
  getMlStatusHandler,
  scoreSingleLeadHandler,
  rescoreAllOpenLeadsHandler,
  triggerModelRetrainHandler,
} from "../controllers/ml.controller.js"

import {
  listPublicInsightsHandler,
  getPublicInsightBySlugHandler,
  getCategoriesHandler,
  trackCtaClickHandler,
  listAdminInsightsHandler,
  getAdminInsightByIdHandler,
  createInsightHandler,
  updateInsightHandler,
  publishInsightHandler,
  unpublishInsightHandler,
  archiveInsightHandler,
  deleteInsightHandler,
  createCategoryHandler,
  generateDraftHandler,
  generateTechBriefHandler,
  aiAssistHandler,
} from "../controllers/insights.controller.js"

export const apiRouter = Router()

apiRouter.get("/health", health)

// Official WhatsApp Webhook endpoints
apiRouter.get("/webhooks/whatsapp", verifyWebhook)
apiRouter.post("/webhooks/whatsapp", handleWebhook)

// Authentication Endpoints
apiRouter.post("/auth/login", authLimiter, login)
apiRouter.post("/auth/refresh", authLimiter, refresh)
apiRouter.post("/auth/logout", requireAuth, logout)
apiRouter.get("/auth/me", requireAuth, me)
apiRouter.post("/auth/activate", authLimiter, activateUser)
apiRouter.post("/auth/forgot-password", authLimiter, forgotPassword)
apiRouter.post("/auth/reset-password", authLimiter, resetPassword)

// Admin User Management Endpoints (Super Admin Only)
apiRouter.get("/users", requireAuth, requireRole("users"), listUsers)
apiRouter.post("/users/invite", requireAuth, requireRole("users"), inviteUser)
apiRouter.patch("/users/:id/status", requireAuth, requireRole("users"), updateUserStatus)
apiRouter.patch("/users/:id/role", requireAuth, requireRole("users"), updateUserRole)

// Public Endpoints
apiRouter.get("/projects", listProjects)
apiRouter.get("/projects/:slug", getProjectBySlug)
apiRouter.get("/team", listTeam)
apiRouter.get("/services", listServices)
apiRouter.get("/faqs", listFaqs)
apiRouter.get("/internships", listInternships)
apiRouter.get("/jobs", listJobs)
apiRouter.get("/settings", getSettings)
apiRouter.get("/cms", getPublicCms)

apiRouter.post("/inquiries", formLimiter, submitInquiry)
apiRouter.post("/contact", formLimiter, submitInquiry)
apiRouter.post("/applications", formLimiter, submitApplication)
apiRouter.post("/chat", chatLimiter, chat)

// Admin CMS Endpoints
apiRouter.get("/admin/cms", requireAuth, getCms)
apiRouter.post("/admin/cms", requireAuth, postCms)

// Admin WhatsApp Management Endpoints
apiRouter.get("/admin/whatsapp/conversations", requireAuth, listConversations)
apiRouter.get("/admin/whatsapp/conversations/:id", requireAuth, getConversation)
apiRouter.post("/admin/whatsapp/conversations/:id/message", requireAuth, sendMessage)
apiRouter.post("/admin/whatsapp/conversations/:id/takeover", requireAuth, takeoverConversation)
apiRouter.post("/admin/whatsapp/conversations/:id/resume-ai", requireAuth, resumeAi)
apiRouter.patch("/admin/whatsapp/conversations/:id/lead", requireAuth, updateLead)

// Admin Quotation Archive Endpoints
apiRouter.get("/admin/quotes", requireAuth, listQuotes)
apiRouter.post("/admin/quotes", requireAuth, upload.single("file"), uploadQuote)
apiRouter.get("/admin/quotes/:id", requireAuth, getQuote)
apiRouter.patch("/admin/quotes/:id", requireAuth, updateQuote)
apiRouter.delete("/admin/quotes/:id", requireAuth, deleteQuote)
apiRouter.get("/admin/quotes/:id/view", requireAuth, viewQuotePdf)
apiRouter.get("/admin/quotes/:id/download", requireAuth, downloadQuotePdf)

// Admin ML Lead Intelligence Endpoints
apiRouter.get("/admin/ml/status", requireAuth, getMlStatusHandler)
apiRouter.post("/admin/leads/:id/score", requireAuth, scoreSingleLeadHandler)
apiRouter.post("/admin/leads/batch-score", requireAuth, rescoreAllOpenLeadsHandler)
apiRouter.post("/admin/ml/retrain", requireAuth, triggerModelRetrainHandler)

// Olinethra Insights Public Endpoints
apiRouter.get("/insights", listPublicInsightsHandler)
apiRouter.get("/insights/categories", getCategoriesHandler)
apiRouter.get("/insights/:slug", getPublicInsightBySlugHandler)
apiRouter.post("/insights/:id/cta-click", trackCtaClickHandler)

// Olinethra Insights Admin Endpoints
apiRouter.get("/admin/insights", requireAuth, requireRole("insights"), listAdminInsightsHandler)
apiRouter.get("/admin/insights/categories", requireAuth, getCategoriesHandler)
apiRouter.post("/admin/insights/categories", requireAuth, requireRole("insights"), createCategoryHandler)
apiRouter.get("/admin/insights/:id", requireAuth, requireRole("insights"), getAdminInsightByIdHandler)
apiRouter.post("/admin/insights", requireAuth, requireRole("insights"), createInsightHandler)
apiRouter.patch("/admin/insights/:id", requireAuth, requireRole("insights"), updateInsightHandler)
apiRouter.post("/admin/insights/:id/publish", requireAuth, requireRole("insights"), publishInsightHandler)
apiRouter.post("/admin/insights/:id/unpublish", requireAuth, requireRole("insights"), unpublishInsightHandler)
apiRouter.post("/admin/insights/:id/archive", requireAuth, requireRole("insights"), archiveInsightHandler)
apiRouter.delete("/admin/insights/:id", requireAuth, requireRole("insights"), deleteInsightHandler)

// Admin Gemini Content Generation & AI Assist Endpoints
apiRouter.post("/admin/insights/generate", requireAuth, requireRole("insights"), aiGenLimiter, generateDraftHandler)
apiRouter.post("/admin/insights/generate-tech-brief", requireAuth, requireRole("insights"), aiGenLimiter, generateTechBriefHandler)
apiRouter.post("/admin/insights/:id/ai-assist", requireAuth, requireRole("insights"), aiGenLimiter, aiAssistHandler)
