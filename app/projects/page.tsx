import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import ProjectsSection from "@/components/sections/ProjectsSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Projects & Portfolio | Olinethra",
  description: "Explore selected case studies and web development projects engineered by Olinethra.",
}

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-neutral-200 bg-neutral-950 py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ PORTFOLIO & WORK ]
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Selected Client Work & Software
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-300">
              Detailed technical case studies showcasing web platforms, SaaS dashboards, and headless e-commerce architectures.
            </p>
          </div>
        </section>

        <ProjectsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
