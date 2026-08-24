import crypto from "crypto"
import { env } from "../../config/env.js"
import type { WhatsAppWebhookPayload } from "./types.js"
import { findOrCreateConversation, storeMessage } from "./message.service.js"
import { processWhatsAppMessage } from "../ai/whatsappAgent.service.js"
import { sendWhatsAppMessage } from "./whatsapp.service.js"


export function verifyWebhookChallenge(
  mode: string | undefined,
  token: string | undefined,
  challenge: string | undefined
): { valid: boolean; challenge?: string } {
  if (mode === "subscribe" && token === env.WHATSAPP_WEBHOOK_VERIFY_TOKEN && challenge) {
    return { valid: true, challenge }
  }
  return { valid: false }
}

export function verifyWhatsAppSignature(
  rawBody: Buffer | string,
  signatureHeader: string | undefined
): boolean {
  const secret = env.WHATSAPP_APP_SECRET
  if (!secret) return true // If secret not configured in dev, pass signature check
  if (!signatureHeader) return false

  const [algorithm, signature] = signatureHeader.split("=")
  if (algorithm !== "sha256" || !signature) return false

  const hmac = crypto.createHmac("sha256", secret)
  const digest = hmac.update(rawBody).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export async function handleWhatsAppWebhookEvent(payload: WhatsAppWebhookPayload): Promise<void> {
  if (!payload.entry || !Array.isArray(payload.entry)) return

  for (const entry of payload.entry) {
    for (const change of entry.changes || []) {
      const value = change.value
      if (!value) continue

      // Process message status updates (sent, delivered, read, failed)
      if (value.statuses && Array.isArray(value.statuses)) {
        for (const statusObj of value.statuses) {
          // Status updates logged safely
          console.log(`[WHATSAPP STATUS UPDATE] ID: ${statusObj.id} | Status: ${statusObj.status}`)
        }
      }

      // Process incoming user messages
      if (value.messages && Array.isArray(value.messages)) {
        const contact = value.contacts?.[0]
        const displayName = contact?.profile?.name || "WhatsApp User"

        for (const incomingMsg of value.messages) {
          const from = incomingMsg.from
          const messageId = incomingMsg.id
          const messageType = incomingMsg.type

          let textContent = ""
          if (messageType === "text" && incomingMsg.text) {
            textContent = incomingMsg.text.body
          } else if (messageType === "button" && incomingMsg.text) {
            textContent = incomingMsg.text.body
          } else if (messageType === "interactive" && incomingMsg.interactive) {
            textContent =
              incomingMsg.interactive.button_reply?.title ||
              incomingMsg.interactive.list_reply?.title ||
              "Interactive selection"
          } else {
            textContent = `Received media message (${messageType})`
          }

          // 1. Find or create conversation
          const conversation = await findOrCreateConversation(from, from, displayName)

          // 2. Idempotency check & store message
          const { message, isDuplicate } = await storeMessage({
            conversationId: conversation._id,
            externalMessageId: messageId,
            direction: "INBOUND",
            senderType: "USER",
            type: messageType === "text" ? "text" : "unsupported",
            text: textContent,
          })

          if (isDuplicate) {
            console.log(`[WHATSAPP WEBHOOK] Duplicate message ignored: ${messageId}`)
            continue
          }

          // 3. Check AI status — If AI is paused (Human handoff), do not auto reply!
          if (!conversation.aiEnabled) {
            console.log(`[WHATSAPP AGENT] AI disabled for conversation ${conversation._id}. Human takeover active.`)
            continue
          }

          // 4. Process with WhatsApp AI Agent
          const agentResult = await processWhatsAppMessage(conversation, textContent)

          // 5. Store AI reply & send out via WhatsApp API
          const replyResult = await sendWhatsAppMessage(from, agentResult.reply)

          await storeMessage({
            conversationId: conversation._id,
            externalMessageId: replyResult.messageId,
            direction: "OUTBOUND",
            senderType: "AI",
            type: "text",
            text: agentResult.reply,
            status: replyResult.success ? "sent" : "failed",
            metadata: { intent: agentResult.intent },
          })
        }
      }
    }
  }
}
