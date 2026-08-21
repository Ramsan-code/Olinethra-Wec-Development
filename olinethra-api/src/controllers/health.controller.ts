import type { Request, Response } from "express"
import { getDatabaseStatus } from "../config/database.js"

export function health(_req: Request, res: Response) {
  return res.json({
    success: true,
    status: "healthy",
    database: getDatabaseStatus(),
    version: "1.0.0",
  })
}
