import * as React from "react"

export interface DifficultyBadgeProps {
  difficulty: "EASY" | "MEDIUM" | "HARD"
}

export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const styles = {
    EASY: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400",
    MEDIUM: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400",
    HARD: "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400",
  }

  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  )
}
