import { Schema, model } from "mongoose"

export interface IActivityLog {
  legacyId: string
  user: string
  action: string
  entity: string
  date: string
  resourceId?: string
  metadata?: Record<string, unknown>
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    user: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true, index: true },
    date: { type: String, index: true },
    resourceId: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
)

activityLogSchema.index({ createdAt: -1 })

export const ActivityLog = model<IActivityLog>("ActivityLog", activityLogSchema)
