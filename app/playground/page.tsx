import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"
import PlaygroundCard from "@/components/playground/PlaygroundCard"
import { Terminal, Key, Bug, Brain, ArrowUpRight, GraduationCap, Code2, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Olinethra Playground — Developer Challenges & Mini Games",
  description: "Test your logic, spot bugs, and solve quick interactive engineering challenges from Olinethra Software Studio.",
  openGraph: {
    title: "Olinethra Playground — Interactive Developer Challenges",
    description: "Code Breaker, Bug Hunt, and Logic Puzzles for curious developers and prospective clients.",
    type: "website",
    url: "/playground",
  },
}

export default function PlaygroundLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-neutral-200 bg-neutral-950 py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400 uppercase tracking-widest">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span>[ OLINETHRA LABS & EXPERIMENTS ]</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Olinethra Playground
            </h1>

            <p className="max-w-2xl text-lg text-neutral-300 leading-relaxed font-light">
              Small experiments for curious minds. Test your logic, spot bugs, and solve quick engineering challenges.
            </p>
          </div>
        </section>

        {/* Featured Mini Games Grid */}
        <section className="py-20 border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col gap-2 border-b border-neutral-200 pb-4 dark:border-neutral-800">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                [ INTERACTIVE CHALLENGES ]
              </span>
              <h2 className="text-2xl font-black text-neutral-950 dark:text-neutral-50">
                Choose a Challenge
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PlaygroundCard
                title="Code Breaker"
                description="Decode the secret 4-digit combination using position and digit feedback in 8 attempts or fewer."
                category="PUZZLE"
                difficulty="EASY"
                estTime="~2 min"
                href="/playground/code-breaker"
                icon={<Key className="h-5 w-5 text-emerald-500" />}
                badgeText="Logic Combination"
              />

              <PlaygroundCard
                title="Bug Hunt"
                description="Spot state mutations, off-by-one loops, stale closures, and security flaws in real JavaScript & React snippets."
                category="DEVELOPER"
                difficulty="MEDIUM"
                estTime="~3 min"
                href="/playground/bug-hunt"
                icon={<Bug className="h-5 w-5 text-blue-500" />}
                badgeText="15+ Challenges"
              />

              <PlaygroundCard
                title="Logic Puzzle"
                description="Test your pattern recognition, Boolean algebra, sequence deduction, and algorithmic problem-solving."
                category="LOGIC"
                difficulty="MEDIUM"
                estTime="~3 min"
                href="/playground/logic"
                icon={<Brain className="h-5 w-5 text-purple-500" />}
                badgeText="Sequences & Boolean"
              />
            </div>

            {/* Careers & Client Cross-links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  <GraduationCap className="h-4 w-4" />
                  <span>Careers & Internships</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">
                  Passionate about software craft?
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We build production web platforms and mentor early-career engineers. Explore open roles and internship opportunities.
                </p>
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-950 dark:text-neutral-50 hover:text-emerald-600 transition-colors"
                >
                  <span>Explore Careers</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900/60 space-y-4">
                <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                  <Code2 className="h-4 w-4" />
                  <span>Engineering Studio</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">
                  Building high-performance web systems
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Need custom full-stack web applications, Next.js architecture, or AI integration? Discover our production portfolio.
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-950 dark:text-neutral-50 hover:text-blue-600 transition-colors"
                >
                  <span>Explore Projects</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
