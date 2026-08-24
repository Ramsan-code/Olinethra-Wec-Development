import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import CodeBreakerGame from "@/components/playground/CodeBreakerGame"

export const metadata: Metadata = {
  title: "Code Breaker — Olinethra Playground",
  description: "Decode the secret combination in 8 attempts or fewer using position and digit feedback.",
}

export default function CodeBreakerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <CodeBreakerGame />
        </div>
      </main>
      <Footer />
    </div>
  )
}
