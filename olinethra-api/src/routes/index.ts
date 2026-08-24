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
import { authLimiter, chatLimiter, formLimiter } from "../middleware/rateLimit.middleware.js"

import {
  verifyWebhook,
  handleWebhook,
  listConversations,
  getConversation,
  sendMessage,
  takeoverConversation,
  resumeAi,
  updateLead,
  listLeads,
  getInsights,
} from "../controllers/whatsapp.controller.js"

export const apiRouter = Router()

apiRouter.get("/health", health)

// Official WhatsApp Webhook endpoints
apiRouter.get("/webhooks/whatsapp", verifyWebhook)
apiRouter.post("/webhooks/whatsapp", handleWebhook)

apiRouter.post("/auth/login", authLimiter, login)
apiRouter.post("/auth/refresh", authLimiter, refresh)
apiRouter.post("/auth/logout", requireAuth, logout)
apiRouter.get("/auth/me", requireAuth, me)

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

// Backward-compatible endpoint used by the existing Admin Dashboard. The
// service layer persists each entity in its own MongoDB collection.
apiRouter.get("/admin/cms", requireAuth, getCms)
apiRouter.post("/admin/cms", requireAuth, postCms)

// Admin WhatsApp Management Endpoints
apiRouter.get("/admin/whatsapp/conversations", requireAuth, listConversations)
apiRouter.get("/admin/whatsapp/conversations/:id", requireAuth, getConversation)
apiRouter.post("/admin/whatsapp/conversations/:id/message", requireAuth, sendMessage)
apiRouter.post("/admin/whatsapp/conversations/:id/takeover", requireAuth, takeoverConversation)
apiRouter.post("/admin/whatsapp/conversations/:id/resume-ai", requireAuth, resumeAi)
apiRouter.patch("/admin/whatsapp/conversations/:id/lead", requireAuth, updateLead)
apiRouter.get("/admin/whatsapp/leads", requireAuth, listLeads)
apiRouter.get("/admin/whatsapp/insights", requireAuth, getInsights)

