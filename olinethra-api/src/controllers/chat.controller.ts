import type { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { handleChat } from "../services/chat.service.js"
import { logActivity } from "../services/activity.service.js"

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }).strict()
    )
    .min(1)
    .max(20),
}).strict()

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    const { messages } = chatSchema.parse(req.body)
    const latest = messages[messages.length - 1]?.content || ""

    logActivity({
      user: "Visitor (Chatbot)",
      action: `Asked: "${latest.slice(0, 50)}..."`,
      entity: "Chatbot",
    }).catch(() => {})

    const result = await handleChat(messages)
    return res.json(result)
  } catch (err) {
    next(err)
  }
}
