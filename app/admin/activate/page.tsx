"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, ShieldAlert, ShieldCheck, Eye, EyeOff, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ActivateAdminContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError("Activation token is missing from URL.")
      return
    }
    if (password.length < 12) {
      setError("Password must be at least 12 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/admin/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess(true)
      } else {
        setError(data.error?.message || "Failed to activate admin account.")
      }
    } catch {
      setError("Network or server connection error.")
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
            Activate Admin Account
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            [ OLINETHRA PORTAL INVITATION ]
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur">
          {success ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-sans text-white">Account Activated</h3>
              <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                Your administrator account has been activated. You can now sign in to the Admin Portal.
              </p>
              <Button asChild className="w-full bg-white text-neutral-950 hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider">
                <Link href="/admin/login">Proceed to Sign In</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleActivate} className="space-y-4">
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                You have been invited to join the Olinethra Admin Portal. Please set a secure password to complete your account activation.
              </p>

              {error && (
                <div role="alert" className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400 font-mono">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="activate-password" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Choose Password (min 12 chars)
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <Input
                    id="activate-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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

              <div className="space-y-1.5">
                <Label htmlFor="activate-confirm" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <Input
                    id="activate-confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9 bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 text-xs h-10 focus:border-white"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !password || !confirmPassword || !token}
                className="w-full h-10 bg-white text-neutral-950 hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider"
              >
                {isSubmitting ? "Activating Account..." : "Activate Account & Sign In"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ActivateAdminPage() {
  return (
    <React.Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white font-mono text-xs">Loading...</div>}>
      <ActivateAdminContent />
    </React.Suspense>
  )
}
