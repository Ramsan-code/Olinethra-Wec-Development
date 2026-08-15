import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import ServicesSection from "@/components/sections/ServicesSection"
import TechnologiesSection from "@/components/sections/TechnologiesSection"
import ProcessSection from "@/components/sections/ProcessSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Services & Technical Solutions | Olinethra",
  description: "Web development, UI/UX design, full-stack engineering, e-commerce storefronts, and performance optimization services by Olinethra.",
}

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-neutral-200 bg-neutral-950 py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ TECHNICAL CAPABILITIES ]
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Services & Engineering Solutions
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-300">
              From initial architecture discovery to high-scale production deployment, we deliver web software built with precision and speed.
            </p>
          </div>
        </section>

        <ServicesSection />
        <TechnologiesSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
