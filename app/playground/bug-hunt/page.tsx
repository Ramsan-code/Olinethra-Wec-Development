import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import BugHuntGame from "@/components/playground/BugHuntGame"

export const metadata: Metadata = {
  title: "Bug Hunt — Olinethra Playground",
  description: "Spot state mutations, closure bugs, hydration errors, and security flaws in JavaScript, TypeScript & React code snippets.",
}

export default function BugHuntPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <BugHuntGame />
        </div>
      </main>
      <Footer />
    </div>
  )
}
