import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { env } from "../config/env.js"
import { User } from "../models/User.js"

async function createAdmin() {
  const args = process.argv.slice(2)
  const emailArg = args.find((a) => a.startsWith("--email="))?.split("=")[1]
  const nameArg = args.find((a) => a.startsWith("--name="))?.split("=")[1]
  const passwordArg = args.find((a) => a.startsWith("--password="))?.split("=")[1]
  const roleArg = args.find((a) => a.startsWith("--role="))?.split("=")[1] || "Super Admin"

  const email = emailArg || "admin@olinethra.com"
  const name = nameArg || "Olinethra Super Admin"
  const password = passwordArg || "OlinethraSuperSecret123!"
  const role = roleArg as "Super Admin" | "Content Admin" | "Hiring Admin"

  console.log(`Connecting to MongoDB...`)
  await mongoose.connect(env.MONGODB_URI)

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    console.log(`User with email ${email} already exists. Updating role to ${role}...`)
    existing.role = role
    existing.isActive = true
    existing.status = "ACTIVE"
    existing.passwordHash = await bcrypt.hash(password, 12)
    await existing.save()
    console.log(`Successfully updated existing admin account: ${email}`)
    await mongoose.disconnect()
    process.exit(0)
  }

  const legacyId = `usr_${Date.now()}`
  const passwordHash = await bcrypt.hash(password, 12)

  const user = new User({
    legacyId,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    isActive: true,
    status: "ACTIVE",
  })

  await user.save()
  console.log(`Successfully created Super Admin account: ${email} (Role: ${role})`)
  await mongoose.disconnect()
  process.exit(0)
}

createAdmin().catch((err) => {
  console.error("Error creating admin:", err)
  process.exit(1)
})
