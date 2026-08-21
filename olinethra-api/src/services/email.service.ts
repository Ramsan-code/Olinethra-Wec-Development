import { env } from "../config/env.js"

export interface EmailPayload {
  to: string
  subject: string
  body: string
  templateName?: "inquiry_confirmation" | "application_confirmation" | "status_update" | "admin_alert"
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string }> {
  try {
    if (env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: [payload.to],
          subject: payload.subject,
          text: payload.body,
        }),
      })

      if (res.ok) {
        const data = (await res.json()) as { id?: string }
        return { success: true, messageId: data.id }
      }

      console.error(`[EMAIL] Provider rejected request with status ${res.status}`)
      return { success: false }
    }

    if (env.NODE_ENV === "development") {
      console.log(`[EMAIL] To: ${payload.to} | Subject: ${payload.subject}`)
    }

    return { success: true, messageId: `local-${Date.now()}` }
  } catch (error) {
    console.error("[EMAIL] Failed:", error)
    return { success: false }
  }
}

export async function notifyAdmin(subject: string, body: string) {
  if (!env.ADMIN_EMAIL) return
  await sendEmail({ to: env.ADMIN_EMAIL, subject, body, templateName: "admin_alert" })
}
