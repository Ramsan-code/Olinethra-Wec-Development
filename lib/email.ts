export interface EmailPayload {
  to: string
  subject: string
  body: string
  templateName?: "inquiry_confirmation" | "application_confirmation" | "status_update" | "admin_alert"
}

/**
 * Lightweight, production-safe Email Service Helper.
 * In development or when SMTP credentials are not configured, it logs email triggers
 * to server console / audit logs while ensuring zero application crashes.
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string }> {
  try {
    console.log(`[EMAIL SYSTEM] Sending email to: ${payload.to}`)
    console.log(`[EMAIL SYSTEM] Subject: ${payload.subject}`)
    console.log(`[EMAIL SYSTEM] Body Preview:\n${payload.body.slice(0, 150)}...\n`)

    // If environment variables for SMTP or SendGrid/Resend are present, send real email:
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "Olinethra <noreply@olinethra.com>",
          to: [payload.to],
          subject: payload.subject,
          text: payload.body,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        return { success: true, messageId: data.id }
      }
    }

    // Default graceful success for local & demo environments
    return { success: true, messageId: `local-sim-${Date.now()}` }
  } catch (error) {
    console.error("[EMAIL SYSTEM] Error triggering email:", error)
    return { success: false }
  }
}
