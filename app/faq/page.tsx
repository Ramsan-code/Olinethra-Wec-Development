import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import FAQSection from "@/components/sections/FAQSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Olinethra",
  description: "Find answers to common questions about Olinethra services, software process, pricing, and internships.",
}

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-neutral-200 bg-neutral-950 py-16 sm:py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ FAQ ]
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h1>
          </div>
        </section>

        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
