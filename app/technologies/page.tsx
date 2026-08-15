import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import TechnologiesSection from "@/components/sections/TechnologiesSection"
import ProcessSection from "@/components/sections/ProcessSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Technologies & Engineering Stack | Olinethra",
  description: "Next.js, React, TypeScript, Node.js, Express, PostgreSQL, MongoDB, and Tailwind CSS engineering stack at Olinethra.",
}

export default function TechnologiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-neutral-200 bg-neutral-950 py-16 sm:py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ STACK & ARCHITECTURE ]
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Technology Stack & Tooling
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-300">
              Our engineering choices prioritize performance, type safety, modular architecture, and long-term maintainability.
            </p>
          </div>
        </section>

        <TechnologiesSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
