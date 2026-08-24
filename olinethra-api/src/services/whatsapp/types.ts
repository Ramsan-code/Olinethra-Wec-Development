export interface WhatsAppWebhookEntry {
  id: string
  changes: Array<{
    value: {
      messaging_product: string
      metadata: {
        display_phone_number: string
        phone_number_id: string
      }
      contacts?: Array<{
        profile: {
          name: string
        }
        wa_id: string
      }>
      messages?: Array<{
        from: string
        id: string
        timestamp: string
        type: "text" | "image" | "document" | "interactive" | "button" | string
        text?: {
          body: string
        }
        image?: {
          id: string
          mime_type: string
          sha256: string
          caption?: string
        }
        document?: {
          id: string
          filename?: string
          mime_type?: string
          caption?: string
        }
        interactive?: {
          type: string
          button_reply?: {
            id: string
            title: string
          }
          list_reply?: {
            id: string
            title: string
            description?: string
          }
        }
      }>
      statuses?: Array<{
        id: string
        status: "sent" | "delivered" | "read" | "failed"
        timestamp: string
        recipient_id: string
        errors?: Array<{
          code: number
          title: string
        }>
      }>
    }
    field: string
  }>
}

export interface WhatsAppWebhookPayload {
  object: string
  entry?: WhatsAppWebhookEntry[]
}

export interface SendMessageResult {
  success: boolean
  messageId?: string
  error?: string
}
