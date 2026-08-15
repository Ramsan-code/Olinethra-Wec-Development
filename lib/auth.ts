export interface AdminUser {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Content Admin" | "Hiring Admin"
}

export const DEMO_ADMINS: Array<AdminUser & { password: string }> = [
  {
    id: "admin-super",
    name: "Olinethra Director",
    email: "admin@olinethra.com",
    password: "admin123",
    role: "Super Admin",
  },
  {
    id: "admin-content",
    name: "Content Manager",
    email: "content@olinethra.com",
    password: "content123",
    role: "Content Admin",
  },
  {
    id: "admin-hiring",
    name: "Talent Specialist",
    email: "hiring@olinethra.com",
    password: "hiring123",
    role: "Hiring Admin",
  },
]

export const SESSION_COOKIE_NAME = "olinethra_admin_session"

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!sessionCookie) return null

    // Session token format: base64 encoded user info
    const decoded = Buffer.from(sessionCookie, "base64").toString("utf-8")
    const parsed = JSON.parse(decoded) as AdminUser

    const found = DEMO_ADMINS.find((a) => a.email === parsed.email)
    if (!found) return null

    return {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    }
  } catch (error) {
    return null
  }
}

export function createSessionToken(user: AdminUser): string {
  const payload = { id: user.id, name: user.name, email: user.email, role: user.role }
  return Buffer.from(JSON.stringify(payload)).toString("base64")
}
