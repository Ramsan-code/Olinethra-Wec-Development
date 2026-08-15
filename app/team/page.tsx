import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import TeamSection from "@/components/sections/TeamSection"
import CareersSection from "@/components/sections/CareersSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Our Team | Olinethra",
  description: "Meet the engineering leadership, developers, and designers at Olinethra.",
}

export default function TeamPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-neutral-200 bg-neutral-950 py-16 sm:py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ OUR PEOPLE ]
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Engineering Leadership & Staff
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-300">
              The full-stack developers, UI architects, and QA engineers who build software at Olinethra.
            </p>
          </div>
        </section>

        <TeamSection />
        <CareersSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
