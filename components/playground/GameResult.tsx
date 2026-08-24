import * as React from "react"
import Link from "next/link"
import { Trophy, RefreshCw, ArrowUpRight, GraduationCap, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface GameResultProps {
  title?: string
  score: number
  totalQuestions?: number
  correctAnswers?: number
  attempts?: number
  onRestart: () => void
  ctaType?: "CAREERS" | "CLIENT" | "BOTH"
}

export default function GameResult({
  title = "Challenge Completed!",
  score,
  totalQuestions,
  correctAnswers,
  attempts,
  onRestart,
  ctaType = "BOTH",
}: GameResultProps) {
  const percentage =
    totalQuestions && correctAnswers !== undefined
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : null

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900 shadow-md space-y-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
        <Trophy className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-neutral-950 dark:text-neutral-50">{title}</h3>
        <p className="font-mono text-sm text-neutral-500">
          Final Score: <strong className="text-neutral-950 dark:text-neutral-50 font-bold">{score} XP</strong>
        </p>

        {percentage !== null && (
          <p className="font-mono text-xs text-neutral-500">
            Accuracy: {correctAnswers}/{totalQuestions} ({percentage}%)
          </p>
        )}

        {attempts !== undefined && (
          <p className="font-mono text-xs text-neutral-500">
            Solved in {attempts} {attempts === 1 ? "attempt" : "attempts"}
          </p>
        )}
      </div>

      <div className="flex justify-center pt-2">
        <Button onClick={onRestart} className="font-mono text-xs gap-2 bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
          <RefreshCw className="h-4 w-4" />
          <span>Play Again</span>
        </Button>
      </div>

      {/* Careers & Client Contextual CTAs */}
      <div className="border-t border-neutral-100 pt-6 dark:border-neutral-800 space-y-3">
        {(ctaType === "CAREERS" || ctaType === "BOTH") && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs dark:border-neutral-800 dark:bg-neutral-950 space-y-2">
            <div className="flex items-center justify-center gap-1.5 font-mono font-bold text-neutral-800 dark:text-neutral-200">
              <GraduationCap className="h-4 w-4 text-emerald-500" />
              <span>Enjoy debugging and solving engineering problems?</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Explore Olinethra mentorship internships & software engineering roles.
            </p>
            <Link
              href="/#careers"
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Explore Olinethra Careers</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {(ctaType === "CLIENT" || ctaType === "BOTH") && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs dark:border-neutral-800 dark:bg-neutral-950 space-y-2">
            <div className="flex items-center justify-center gap-1.5 font-mono font-bold text-neutral-800 dark:text-neutral-200">
              <Code2 className="h-4 w-4 text-blue-500" />
              <span>Looking for high-performance web systems?</span>
            </div>
            <p className="text-neutral-500 text-[11px]">
              Olinethra builds fast, thoughtful digital platforms and software products.
            </p>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>See Our Production Work</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
