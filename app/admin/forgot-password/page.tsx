"use client"

import * as React from "react"
import Link from "next/link"
import { Mail, ShieldCheck, ArrowLeft, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    try {
      await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
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
            Reset Password
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            [ ADMIN PORTAL ACCOUNT RECOVERY ]
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur">
          {submitted ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-sm font-sans text-neutral-300 leading-relaxed">
                If an active admin account exists for <strong className="text-white font-mono">{email}</strong>, password reset instructions have been dispatched.
              </p>
              <Button asChild variant="outline" className="w-full border-neutral-700 text-xs font-mono">
                <Link href="/admin/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Admin Login
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Enter your registered administrator email address to receive a secure password reset link.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="reset-email" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="admin@olinethra.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 text-xs h-10 focus:border-white"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full h-10 bg-white text-neutral-950 hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider"
              >
                {isSubmitting ? "Sending..." : "Send Reset Instructions"}
              </Button>

              <div className="text-center pt-2">
                <Link href="/admin/login" className="inline-flex items-center gap-1 font-mono text-xs text-neutral-400 hover:text-white transition-colors">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
