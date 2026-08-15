import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import ContactSection from "@/components/sections/ContactSection"
import FAQSection from "@/components/sections/FAQSection"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Contact Us | Olinethra",
  description: "Get in touch with Olinethra for new project inquiries, software consultations, or technical partnerships.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-neutral-200 bg-neutral-950 py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ GET IN TOUCH ]
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Contact Engineering
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-300">
              Ready to build something great? Reach out to start a conversation about your software requirements.
            </p>
          </div>
        </section>

        <ContactSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
