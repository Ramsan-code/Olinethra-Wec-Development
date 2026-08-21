import { ActivityLog } from "../models/ActivityLog.js"
import { generateLegacyId, todayISO } from "../utils/helpers.js"

export async function logActivity(input: {
  user: string
  action: string
  entity: string
  resourceId?: string
  metadata?: Record<string, unknown>
}) {
  await ActivityLog.create({
    legacyId: generateLegacyId("act"),
    user: input.user,
    action: input.action,
    entity: input.entity,
    date: new Date().toISOString(),
    resourceId: input.resourceId,
    metadata: input.metadata,
  })
}

export async function getRecentActivity(limit = 100) {
  const items = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit).lean()
  return items.map(({ legacyId, user, action, entity, date }) => ({
    id: legacyId,
    user,
    action,
    entity,
    date,
  }))
}
