import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import AboutSection from "@/components/sections/AboutSection"
import TeamSection from "@/components/sections/TeamSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "About Us | Olinethra",
  description: "Learn about Olinethra's software engineering philosophy, team leadership, and digital solutions expertise.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        {/* Page Hero Header */}
        <section className="border-b border-neutral-200 bg-neutral-950 py-16 sm:py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ COMPANY OVERVIEW ]
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              About Olinethra
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-300">
              We are a dedicated team of full-stack engineers and product designers crafting high-impact web applications, robust backend architectures, and custom digital experiences.
            </p>
          </div>
        </section>

        <AboutSection />
        <TeamSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}