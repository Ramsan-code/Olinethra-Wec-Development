import { runExpiryAutomation } from "../services/cms.service.js"

let intervalId: ReturnType<typeof setInterval> | null = null

export function startScheduledJobs() {
  if (intervalId) return

  // Run every hour
  intervalId = setInterval(
    () => {
      runExpiryAutomation().catch((err) => console.error("[CRON] Expiry job failed:", err))
    },
    60 * 60 * 1000
  )

  runExpiryAutomation().catch(console.error)
}

export function stopScheduledJobs() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}
