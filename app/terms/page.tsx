import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Terms of Service | Olinethra",
  description: "Terms of service and engineering engagement conditions for Olinethra.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            [ TERMS OF ENGAGEMENT ]
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            Terms of Service
          </h1>
          <p className="text-sm font-mono text-neutral-500">Last updated: August 2026</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400 space-y-4 text-sm leading-relaxed">
            <p>
              Welcome to Olinethra. By accessing our website or engaging our software development services, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">1. Client Services & Work Scope</h2>
            <p>
              All software development, UI design, and consulting engagements are governed by formal Statement of Work (SOW) agreements signed prior to sprint kickoff.
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">2. Intellectual Property Rights</h2>
            <p>
              Upon full receipt of contractual payments, all deliverables, custom source code, assets, and design files created for the client become the sole property of the client.
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">3. Code Standards & Warranties</h2>
            <p>
              We warrant that all code delivered adheres to modern industry standards, is thoroughly tested, and includes agreed post-launch bug warranty periods specified in your service contract.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
