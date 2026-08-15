import { NextResponse } from "next/server"
import { DEMO_ADMINS, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    const admin = DEMO_ADMINS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    )

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials. Please try again." }, { status: 401 })
    }

    const token = createSessionToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    })

    const response = NextResponse.json({
      success: true,
      user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    })

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Internal authentication error." }, { status: 500 })
  }
}
