"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

const messages: Record<string, string> = {
  cancelled: "Google sign-in was cancelled.",
  unauthorized: "This Google account is not authorized to access the Olinethra Admin Portal.",
  invalid_state: "The sign-in request expired or could not be verified. Please try again.",
  not_configured: "Google sign-in is not configured yet. Please contact an administrator.",
  google_error: "Google could not complete sign-in. Please try again.",
  token_exchange: "Google sign-in could not be completed. Please try again.",
  verification: "Your Google identity could not be verified. Please try again.",
  unavailable: "Google sign-in is temporarily unavailable. Please try again.",
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.64-2.43l-3.24-2.54c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.62A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.86A6.01 6.01 0 0 1 6.08 12c0-.65.11-1.28.31-1.86V7.52H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.48l3.34-2.62Z" />
      <path fill="#EA4335" d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.95 5.52l3.34 2.62C7.18 7.77 9.39 6.01 12 6.01Z" />
    </svg>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [redirecting, setRedirecting] = React.useState(false)
  const error = searchParams.get("error")
  const next = searchParams.get("next")
  const safeNext = next && next.startsWith("/admin") && !next.startsWith("//") && !next.includes("\\") ? next : "/admin"
  const googleHref = `/api/admin/auth/google?next=${encodeURIComponent(safeNext)}`

  React.useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((response) => { if (response.ok) router.replace(safeNext) })
      .catch(() => undefined)
  }, [router, safeNext])

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12 text-white">
      <section aria-labelledby="login-title" className="w-full max-w-sm border border-neutral-800 bg-neutral-950 px-6 py-10 sm:px-10">
        <header className="text-center">
          <p className="font-mono text-sm font-black tracking-[0.32em]">OLINETHRA</p>
          <h1 id="login-title" className="mt-8 text-2xl font-semibold tracking-tight">Admin Portal</h1>
        </header>

        {error && (
          <p role="alert" aria-live="polite" className="mt-6 border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm leading-6 text-neutral-200">
            {messages[error] || "Sign-in could not be completed. Please try again."}
          </p>
        )}

        <Link
          href={googleHref}
          onClick={() => setRedirecting(true)}
          aria-disabled={redirecting}
          className={`mt-8 flex min-h-12 w-full items-center justify-center gap-3 border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-950 outline-none transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${redirecting ? "pointer-events-none opacity-70" : ""}`}
        >
          <GoogleMark />
          <span>{redirecting ? "Redirecting to Google…" : "Continue with Google"}</span>
        </Link>

        <p className="mt-6 text-center text-xs leading-5 text-neutral-500">Authorized Olinethra administrators only.</p>
        <p className="mt-10 text-center">
          <Link href="/" className="text-xs text-neutral-500 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Back to Olinethra
          </Link>
        </p>
      </section>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-neutral-950" />}>
      <LoginContent />
    </React.Suspense>
  )
}
