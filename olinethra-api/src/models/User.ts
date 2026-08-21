import { Schema, model } from "mongoose"
import type { AdminRole } from "../types/index.js"

export interface IUser {
  legacyId: string
  name: string
  email: string
  passwordHash: string
  role: AdminRole
  isActive: boolean
}

const userSchema = new Schema<IUser>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Super Admin", "Content Admin", "Hiring Admin"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const User = model<IUser>("User", userSchema)
