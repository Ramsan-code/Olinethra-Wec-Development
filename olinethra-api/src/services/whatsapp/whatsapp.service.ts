import { env } from "../../config/env.js"
import type { SendMessageResult } from "./types.js"

export async function sendWhatsAppMessage(
  to: string,
  text: string
): Promise<SendMessageResult> {
  const token = env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    console.log(`[WHATSAPP MOCK SEND] To: ${to} | Message: ${text.slice(0, 80)}...`)
    return {
      success: true,
      messageId: `mock_msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    }
  }

  try {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to.replace(/[^0-9]/g, ""),
      type: "text",
      text: {
        preview_url: false,
        body: text,
      },
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = (await res.json()) as {
      messages?: Array<{ id: string }>
      error?: { message: string; code: number }
    }

    if (!res.ok || data.error) {
      const errMsg = data.error?.message || `HTTP ${res.status} error sending WhatsApp message`
      console.error("[WHATSAPP API ERROR]", errMsg)
      return { success: false, error: errMsg }
    }

    const messageId = data.messages?.[0]?.id || `msg_${Date.now()}`
    return { success: true, messageId }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error("[WHATSAPP SEND EXCEPTION]", errorMessage)
    return { success: false, error: errorMessage }
  }
}

export async function markWhatsAppMessageAsRead(messageId: string): Promise<boolean> {
  const token = env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) return true

  try {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
