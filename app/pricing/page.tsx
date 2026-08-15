import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import FAQSection from "@/components/sections/FAQSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Engagement Models & Pricing | Olinethra",
  description: "Transparent engagement models for custom web development, design systems, and software engineering.",
}

const tiers = [
  {
    name: "Startup Sprint",
    tagline: "For early-stage startups needing rapid MVP execution",
    price: "Custom Scope",
    features: [
      "Next.js App Router Architecture",
      "Tailwind & shadcn/ui Component Library",
      "Core API & Database Setup",
      "SEO & Mobile Responsiveness",
      "Vercel Deployment & SSL",
    ],
    cta: "Request MVP Proposal",
  },
  {
    name: "Full Product Engineering",
    tagline: "Comprehensive web application design & full-stack development",
    price: "Fixed Sprint / Retainer",
    featured: true,
    features: [
      "Custom Figma UI/UX Design System",
      "Full-Stack Next.js + Node/PostgreSQL",
      "Role-Based Authentication & Permissions",
      "Stripe / Payment Gateway Integration",
      "Automated Testing & 99+ Web Vitals",
      "Post-Launch Maintenance Support",
    ],
    cta: "Start Product Project",
  },
  {
    name: "Enterprise & Dedicated Support",
    tagline: "Dedicated engineering staff, SLA maintenance & optimization",
    price: "Monthly Retainer",
    features: [
      "Dedicated Full-Stack & UI Team",
      "Continuous Integration & DevOps",
      "Performance Audits & Core Vitals Monitoring",
      "Priority SLA Response Time",
      "Continuous Code Refactoring & Security Updates",
    ],
    cta: "Schedule Enterprise Call",
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-neutral-200 bg-neutral-950 py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ TRANSPARENT PRICING ]
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Engagement Models
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-300">
              Predictable, milestone-based pricing tailored to your technical requirements and growth stage.
            </p>
          </div>
        </section>

        <section className="py-24 border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`flex flex-col justify-between rounded-xl border p-8 transition-all ${
                    tier.featured
                      ? "border-neutral-900 bg-neutral-950 text-white shadow-xl dark:border-neutral-100 dark:bg-neutral-900"
                      : "border-neutral-200 bg-white text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50"
                  }`}
                >
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest opacity-60">
                      {tier.name}
                    </div>
                    <h3 className="text-2xl font-extrabold mt-2 mb-1">{tier.price}</h3>
                    <p className="text-xs leading-relaxed opacity-80 mb-6">{tier.tagline}</p>

                    <ul className="space-y-2.5 border-t border-neutral-200/20 pt-6">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs">
                          <Check className="h-4 w-4 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-200/20">
                    <Button
                      asChild
                      variant={tier.featured ? "secondary" : "default"}
                      className="w-full justify-between"
                    >
                      <Link href="/contact">
                        <span>{tier.cta}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
