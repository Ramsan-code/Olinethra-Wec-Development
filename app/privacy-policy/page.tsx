import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Olinethra",
  description: "Privacy policy and data protection standards for Olinethra digital services.",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            [ LEGAL & COMPLIANCE ]
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-neutral-500">Last updated: August 2026</p>
          <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-400 space-y-4 text-sm leading-relaxed">
            <p>
              At Olinethra, we prioritize the protection and security of your personal data and business disclosures. This Privacy Policy details how we collect, handle, and safeguard information submitted through our website and client services.
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">1. Information Collection</h2>
            <p>
              We collect information provided directly by you when filling out contact inquiries, applying for internships, or requesting project specifications (such as your name, email address, company name, and project requirements).
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">2. Use of Information</h2>
            <p>
              Your information is used strictly to respond to project inquiries, process internship applications, fulfill software development contracts, and improve site performance. We never sell or share user data with third-party advertisers.
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">3. Data Security & Confidentiality</h2>
            <p>
              All project inquiries and code repositories are maintained under strict confidentiality standards. We employ industry-standard encryption and security protocols across all our infrastructure.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
