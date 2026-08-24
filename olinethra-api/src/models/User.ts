import { Schema, model } from "mongoose"
import type { AdminRole } from "../types/index.js"

export type AdminStatus = "ACTIVE" | "INVITED" | "DISABLED"

export interface IUser {
  legacyId: string
  name: string
  email: string
  passwordHash: string
  role: AdminRole
  isActive: boolean
  status: AdminStatus
  inviteToken?: string
  inviteTokenExpires?: Date
  resetToken?: string
  resetTokenExpires?: Date
  lastLoginAt?: Date
  createdBy?: string
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
    status: {
      type: String,
      enum: ["ACTIVE", "INVITED", "DISABLED"],
      default: "ACTIVE",
    },
    inviteToken: { type: String, select: false },
    inviteTokenExpires: { type: Date },
    resetToken: { type: String, select: false },
    resetTokenExpires: { type: Date },
    lastLoginAt: { type: Date },
    createdBy: { type: String },
  },
  { timestamps: true }
)

export const User = model<IUser>("User", userSchema)
