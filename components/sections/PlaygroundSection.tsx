import * as React from "react"
import Link from "next/link"
import { Terminal, Key, Bug, Brain, ArrowRight } from "lucide-react"

export default function PlaygroundSection() {
  return (
    <section id="playground" className="py-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-emerald-400 uppercase tracking-widest">
              <Terminal className="h-4 w-4" />
              <span>[ OLINETHRA PLAYGROUND ]</span>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Think Like an Engineer
            </h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-xl">
              Try a 2-minute challenge. Spot bugs, decode combinations, and test your problem-solving logic.
            </p>
          </div>

          <Link
            href="/playground"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-mono text-xs font-bold text-neutral-950 hover:bg-neutral-200 transition-colors"
          >
            <span>Enter Playground</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3 Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/playground/code-breaker"
            className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 hover:border-neutral-600 transition-all space-y-4"
          >
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="rounded bg-neutral-800 px-2 py-0.5 uppercase text-neutral-300">
                PUZZLE
              </span>
              <span className="text-emerald-400 font-bold">~2 min</span>
            </div>

            <div className="flex items-center gap-3">
              <Key className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">
                Code Breaker
              </h3>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Decode the secret 4-digit code using position hints.
            </p>
          </Link>

          <Link
            href="/playground/bug-hunt"
            className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 hover:border-neutral-600 transition-all space-y-4"
          >
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="rounded bg-neutral-800 px-2 py-0.5 uppercase text-neutral-300">
                DEVELOPER
              </span>
              <span className="text-blue-400 font-bold">~3 min</span>
            </div>

            <div className="flex items-center gap-3">
              <Bug className="h-6 w-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors">
                Bug Hunt
              </h3>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Identify state mutations, closures, and logic bugs.
            </p>
          </Link>

          <Link
            href="/playground/logic"
            className="group rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 hover:border-neutral-600 transition-all space-y-4"
          >
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="rounded bg-neutral-800 px-2 py-0.5 uppercase text-neutral-300">
                LOGIC
              </span>
              <span className="text-purple-400 font-bold">~3 min</span>
            </div>

            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-purple-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors">
                Logic Puzzle
              </h3>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Solve sequence patterns, deduction, and Boolean algebra.
            </p>
          </Link>
        </div>
      </div>
    </section>
  )
}
