import type { Request, Response, NextFunction } from "express"
import { verifyWebhookChallenge, handleWhatsAppWebhookEvent } from "../services/whatsapp/webhook.service.js"
import { sendWhatsAppMessage } from "../services/whatsapp/whatsapp.service.js"
import { storeMessage, updateConversationStatus, resetUnreadCount } from "../services/whatsapp/message.service.js"
import { Conversation, Message, Lead } from "../models/index.js"
import { AppError } from "../middleware/error.middleware.js"
import { logActivity } from "../services/activity.service.js"

export async function verifyWebhook(req: Request, res: Response): Promise<void> {
  const mode = req.query["hub.mode"] as string | undefined
  const token = req.query["hub.verify_token"] as string | undefined
  const challenge = req.query["hub.challenge"] as string | undefined

  const { valid, challenge: resChallenge } = verifyWebhookChallenge(mode, token, challenge)

  if (valid && resChallenge) {
    res.status(200).send(resChallenge)
    return
  }

  res.status(403).json({ error: "Webhook verification failed." })
}

export async function handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Return 200 OK fast to webhook provider
    res.status(200).json({ status: "EVENT_RECEIVED" })

    // Asynchronously process event safely
    handleWhatsAppWebhookEvent(req.body).catch((err) => {
      console.error("[WHATSAPP WEBHOOK PROCESSING ERROR]", err)
    })
  } catch (err) {
    next(err)
  }
}

export async function listConversations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status as string | undefined
    const search = req.query.search as string | undefined

    const query: Record<string, unknown> = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ]
    }

    const conversations = await Conversation.find(query)
      .populate("leadId")
      .sort({ lastMessageAt: -1 })
      .lean()

    res.json({ success: true, conversations })
  } catch (err) {
    next(err)
  }
}

export async function getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params
    const conversation = await Conversation.findById(id).populate("leadId").lean()

    if (!conversation) {
      throw new AppError(404, "NOT_FOUND", "Conversation not found.")
    }

    // Reset unread count when admin opens conversation
    await resetUnreadCount(id)

    const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 }).lean()

    res.json({ success: true, conversation, messages })
  } catch (err) {
    next(err)
  }
}

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params
    const { text } = req.body

    if (!text || typeof text !== "string" || !text.trim()) {
      throw new AppError(400, "INVALID_INPUT", "Message text is required.")
    }

    const conversation = await Conversation.findById(id)
    if (!conversation) {
      throw new AppError(404, "NOT_FOUND", "Conversation not found.")
    }

    // Admin sending a message pauses AI automatically & takes over
    conversation.aiEnabled = false
    conversation.status = "HUMAN_HANDOFF"
    await conversation.save()

    if (conversation.leadId) {
      await Lead.findByIdAndUpdate(conversation.leadId, { status: "HUMAN_HANDOFF" })
    }

    // Send outbound message via WhatsApp API
    const sendResult = await sendWhatsAppMessage(conversation.phone, text.trim())

    const { message } = await storeMessage({
      conversationId: conversation._id,
      externalMessageId: sendResult.messageId,
      direction: "OUTBOUND",
      senderType: "ADMIN",
      type: "text",
      text: text.trim(),
      status: sendResult.success ? "sent" : "failed",
    })

    const adminUser = req.user?.name || "Admin"
    await logActivity({
      user: adminUser,
      action: `Sent WhatsApp reply to ${conversation.displayName}`,
      entity: "WhatsApp",
      resourceId: String(conversation._id),
    })

    res.json({ success: true, message, conversation })
  } catch (err) {
    next(err)
  }
}

export async function takeoverConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params
    const updated = await updateConversationStatus(id, "HUMAN_HANDOFF", false)

    if (!updated) {
      throw new AppError(404, "NOT_FOUND", "Conversation not found.")
    }

    const adminUser = req.user?.name || "Admin"
    await logActivity({
      user: adminUser,
      action: `Took over WhatsApp conversation with ${updated.displayName}`,
      entity: "WhatsApp",
      resourceId: id,
    })

    res.json({ success: true, conversation: updated })
  } catch (err) {
    next(err)
  }
}

export async function resumeAi(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params
    const updated = await updateConversationStatus(id, "QUALIFIED", true)

    if (!updated) {
      throw new AppError(404, "NOT_FOUND", "Conversation not found.")
    }

    const adminUser = req.user?.name || "Admin"
    await logActivity({
      user: adminUser,
      action: `Resumed AI Agent for ${updated.displayName}`,
      entity: "WhatsApp",
      resourceId: id,
    })

    res.json({ success: true, conversation: updated })
  } catch (err) {
    next(err)
  }
}

export async function updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params
    const { status, priority, notes, assignedTo, budget, timeline, projectType } = req.body

    const conversation = await Conversation.findById(id)
    if (!conversation || !conversation.leadId) {
      throw new AppError(404, "NOT_FOUND", "Lead or conversation not found.")
    }

    const updateFields: Record<string, unknown> = {}
    if (status) updateFields.status = status
    if (priority) updateFields.priority = priority
    if (notes !== undefined) updateFields.notes = notes
    if (assignedTo) updateFields.assignedTo = assignedTo
    if (budget) updateFields.budget = budget
    if (timeline) updateFields.timeline = timeline
    if (projectType) updateFields.projectType = projectType

    const updatedLead = await Lead.findByIdAndUpdate(conversation.leadId, updateFields, { new: true })

    if (status) {
      conversation.status = status
      await conversation.save()
    }
    if (assignedTo) {
      conversation.assignedTo = assignedTo
      await conversation.save()
    }

    res.json({ success: true, lead: updatedLead, conversation })
  } catch (err) {
    next(err)
  }
}

export async function listLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const leads = await Lead.find({ source: "WHATSAPP" }).sort({ createdAt: -1 }).lean()
    res.json({ success: true, leads })
  } catch (err) {
    next(err)
  }
}

export async function getInsights(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const [totalConversations, totalLeads, handoffsCount, aiActiveCount, messagesCount] = await Promise.all([
      Conversation.countDocuments(),
      Lead.countDocuments({ source: "WHATSAPP" }),
      Conversation.countDocuments({ status: "HUMAN_HANDOFF" }),
      Conversation.countDocuments({ aiEnabled: true }),
      Message.countDocuments(),
    ])

    res.json({
      success: true,
      insights: {
        totalConversations,
        totalLeads,
        handoffsCount,
        aiActiveCount,
        messagesCount,
        topicBreakdown: [
          { topic: "Project Inquiries", count: Math.round(totalLeads * 0.8) },
          { topic: "Services & Features", count: Math.round(totalConversations * 0.4) },
          { topic: "Internships & Careers", count: Math.round(totalConversations * 0.25) },
          { topic: "Pricing & Quotes", count: Math.round(totalConversations * 0.3) },
        ],
      },
    })
  } catch (err) {
    next(err)
  }
}
