import { Schema, model } from "mongoose"

export interface INotification {
  legacyId: string
  type: "inquiry" | "application" | "status" | "expiry"
  title: string
  message: string
  date: string
  read: boolean
  link?: string
}

const notificationSchema = new Schema<INotification>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["inquiry", "application", "status", "expiry"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, index: true },
    read: { type: Boolean, default: false, index: true },
    link: String,
  },
  { timestamps: true }
)

export const Notification = model<INotification>("Notification", notificationSchema)
