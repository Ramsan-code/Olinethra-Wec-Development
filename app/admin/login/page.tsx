"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, Mail, ShieldAlert, Eye, EyeOff, Code2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function AdminLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get("next")

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => {
        if (res.ok) {
          router.replace("/admin")
        }
      })
      .catch(() => {})
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || isSubmitting) return

    setError("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        // Safe redirect to prevent open redirects
        let target = "/admin"
        if (nextUrl && nextUrl.startsWith("/admin") && !nextUrl.startsWith("//")) {
          target = nextUrl
        }
        router.push(target)
      } else {
        setError(data.error?.message || "Invalid email or password.")
      }
    } catch {
      setError("Network or server connection error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-950 text-white px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 font-mono text-lg font-black text-white">
            <Code2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Olinethra Admin Portal
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            [ SECURE INTERNAL CMS ACCESS ]
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur">
          {error && (
            <div role="alert" className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400 font-mono">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@olinethra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 text-xs h-10 focus:border-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Password
                </Label>
                <Link
                  href="/admin/forgot-password"
                  className="font-mono text-[11px] text-neutral-400 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                <Input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 text-xs h-10 focus:border-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full h-10 bg-white text-neutral-950 hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider gap-2 mt-2"
            >
              <span>{isSubmitting ? "Signing in..." : "Sign In to Admin Portal"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="text-center font-mono text-[10px] text-neutral-500">
          Olinethra Enterprise Security • Access Restricted to Authorized Admins
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white font-mono text-xs">Loading...</div>}>
      <AdminLoginContent />
    </React.Suspense>
  )
}
