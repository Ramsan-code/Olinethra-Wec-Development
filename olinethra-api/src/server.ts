import { createServer } from "node:http"
import { app } from "./app.js"
import { connectDatabase, disconnectDatabase } from "./config/database.js"
import { env } from "./config/env.js"
import { startScheduledJobs, stopScheduledJobs } from "./jobs/expiry.job.js"

const server = createServer(app)
let shuttingDown = false

async function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[SERVER] ${signal} received; shutting down`)
  stopScheduledJobs()
  server.close(async () => {
    await disconnectDatabase()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

async function start() {
  await connectDatabase()
  startScheduledJobs()
  server.listen(env.PORT, () => console.log(`[SERVER] Listening on port ${env.PORT}`))
}

process.on("SIGTERM", () => void shutdown("SIGTERM"))
process.on("SIGINT", () => void shutdown("SIGINT"))

start().catch((error) => {
  console.error("[SERVER] Startup failed", error instanceof Error ? error.message : "Unknown error")
  process.exit(1)
})
