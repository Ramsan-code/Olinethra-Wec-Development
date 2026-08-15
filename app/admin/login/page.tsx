"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, Code2, ShieldAlert, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEMO_ADMINS } from "@/lib/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
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
        localStorage.setItem("olinethra_admin_user", JSON.stringify(data.user))
        router.push("/admin")
      } else {
        setError(data.error || "Authentication failed. Please verify email and password.")
      }
    } catch (err) {
      setError("Network or server connection error.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoSelect = (demo: typeof DEMO_ADMINS[0]) => {
    setEmail(demo.email)
    setPassword(demo.password)
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-neutral-950 text-white px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 font-mono text-lg font-black text-white">
            &lt;/&gt;
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            Olinethra Admin Portal
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            [ SECURE CMS ACCESS ]
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 font-mono">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@olinethra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 text-xs h-10 focus:border-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 text-xs h-10 focus:border-white"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-white text-neutral-950 hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to Admin Portal"}
            </Button>
          </form>

          {/* Quick Demo Access Roles */}
          <div className="border-t border-neutral-800 pt-4 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 text-center">
              [ QUICK DEMO ACCOUNTS ]
            </p>
            <div className="space-y-1.5">
              {DEMO_ADMINS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleDemoSelect(demo)}
                  className="flex w-full items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 text-left text-xs transition-colors hover:border-neutral-700 hover:bg-neutral-800/60"
                >
                  <div>
                    <span className="font-bold text-white block">{demo.role}</span>
                    <span className="text-[10px] font-mono text-neutral-400">{demo.email}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center font-mono text-[10px] text-neutral-500">
          Olinethra Enterprise Security • Protected Area
        </p>
      </div>
    </div>
  )
}
