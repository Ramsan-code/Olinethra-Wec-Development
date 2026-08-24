import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import LogicPuzzleGame from "@/components/playground/LogicPuzzleGame"

export const metadata: Metadata = {
  title: "Logic Puzzle — Olinethra Playground",
  description: "Test pattern recognition, sequence deduction, and Boolean logic in short interactive rounds.",
}

export default function LogicPuzzlePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <LogicPuzzleGame />
        </div>
      </main>
      <Footer />
    </div>
  )
}
