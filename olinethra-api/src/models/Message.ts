import { Schema, model, Document, Types } from "mongoose"

export type MessageDirection = "INBOUND" | "OUTBOUND"
export type MessageSenderType = "USER" | "AI" | "ADMIN"
export type MessageType = "text" | "image" | "document" | "interactive" | "unsupported"
export type MessageStatus = "sent" | "delivered" | "read" | "failed" | "received"

export interface IMessage extends Document {
  conversationId: Types.ObjectId
  externalMessageId?: string
  direction: MessageDirection
  senderType: MessageSenderType
  type: MessageType
  text: string
  media?: {
    url?: string
    caption?: string
    mimeType?: string
  }
  status: MessageStatus
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    externalMessageId: { type: String, unique: true, sparse: true, index: true },
    direction: { type: String, enum: ["INBOUND", "OUTBOUND"], required: true },
    senderType: { type: String, enum: ["USER", "AI", "ADMIN"], required: true },
    type: {
      type: String,
      enum: ["text", "image", "document", "interactive", "unsupported"],
      default: "text",
    },
    text: { type: String, required: true },
    media: {
      url: String,
      caption: String,
      mimeType: String,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed", "received"],
      default: "received",
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
)

messageSchema.index({ conversationId: 1, createdAt: 1 })

export const Message = model<IMessage>("Message", messageSchema)
