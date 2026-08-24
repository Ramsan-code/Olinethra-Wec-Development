import { Conversation, Message, Lead } from "../../models/index.js"
import type { MessageDirection, MessageSenderType, MessageType, MessageStatus } from "../../models/Message.js"
import type { LeadStatus } from "../../models/Lead.js"
import { generateLegacyId } from "../../utils/helpers.js"

export async function findOrCreateConversation(
  whatsappUserId: string,
  phone: string,
  displayName?: string
) {
  let conversation = await Conversation.findOne({ whatsappUserId })

  if (!conversation) {
    conversation = await Conversation.create({
      whatsappUserId,
      phone: phone || whatsappUserId,
      displayName: displayName || "WhatsApp User",
      status: "NEW",
      aiEnabled: true,
      assignedTo: "Unassigned",
      lastMessageAt: new Date(),
      unreadCount: 0,
    })
  } else if (displayName && conversation.displayName === "WhatsApp User") {
    conversation.displayName = displayName
    await conversation.save()
  }

  return conversation
}

export async function storeMessage(params: {
  conversationId: string | object
  externalMessageId?: string
  direction: MessageDirection
  senderType: MessageSenderType
  type?: MessageType
  text: string
  media?: { url?: string; caption?: string; mimeType?: string }
  status?: MessageStatus
  metadata?: Record<string, unknown>
}) {
  if (params.externalMessageId) {
    const existing = await Message.findOne({ externalMessageId: params.externalMessageId })
    if (existing) {
      return { message: existing, isDuplicate: true }
    }
  }

  const message = await Message.create({
    conversationId: params.conversationId,
    externalMessageId: params.externalMessageId,
    direction: params.direction,
    senderType: params.senderType,
    type: params.type || "text",
    text: params.text,
    media: params.media,
    status: params.status || (params.direction === "INBOUND" ? "received" : "sent"),
    metadata: params.metadata,
  })

  const updateDoc: Record<string, unknown> = {
    lastMessageAt: new Date(),
  }

  if (params.direction === "INBOUND") {
    updateDoc.$inc = { unreadCount: 1 }
  }

  await Conversation.findByIdAndUpdate(params.conversationId, updateDoc)

  return { message, isDuplicate: false }
}

export async function updateConversationStatus(
  conversationId: string,
  status: LeadStatus,
  aiEnabled?: boolean
) {
  const updateData: Record<string, unknown> = { status }
  if (typeof aiEnabled === "boolean") {
    updateData.aiEnabled = aiEnabled
  }

  const updated = await Conversation.findByIdAndUpdate(conversationId, updateData, { new: true })

  if (updated?.leadId) {
    await Lead.findByIdAndUpdate(updated.leadId, { status })
  }

  return updated
}

export async function resetUnreadCount(conversationId: string) {
  return Conversation.findByIdAndUpdate(conversationId, { unreadCount: 0 })
}
