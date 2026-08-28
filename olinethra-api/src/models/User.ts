import { Schema, model } from "mongoose"
import type { AdminRole } from "../types/index.js"

export type AdminStatus = "ACTIVE" | "INVITED" | "DISABLED"
export type AuthProvider = "LOCAL" | "GOOGLE"

export interface IUser {
  legacyId: string
  name: string
  email: string
  passwordHash?: string
  role: AdminRole
  isActive: boolean
  status: AdminStatus
  inviteToken?: string
  inviteTokenExpires?: Date
  resetToken?: string
  resetTokenExpires?: Date
  lastLoginAt?: Date
  authProvider: AuthProvider
  googleSubjectId?: string
  refreshTokenHash?: string
  createdBy?: string
}

const userSchema = new Schema<IUser>(
  {
    legacyId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, select: false },
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
    authProvider: { type: String, enum: ["LOCAL", "GOOGLE"], default: "LOCAL" },
    googleSubjectId: { type: String, unique: true, sparse: true, select: false },
    refreshTokenHash: { type: String, select: false },
    createdBy: { type: String },
  },
  { timestamps: true }
)

export const User = model<IUser>("User", userSchema)
