import mongoose from "mongoose"
import { env } from "./env.js"

let isConnected = false

export async function connectDatabase(): Promise<void> {
  if (isConnected) return

  mongoose.set("strictQuery", true)

  await mongoose.connect(env.MONGODB_URI)
  isConnected = true
  console.log("[DB] MongoDB connected")
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return
  await mongoose.disconnect()
  isConnected = false
  console.log("[DB] MongoDB disconnected")
}

export function getDatabaseStatus(): "connected" | "disconnected" {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected"
}
