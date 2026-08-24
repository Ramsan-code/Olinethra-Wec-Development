import * as React from "react"
import { Trophy, Flame, Target } from "lucide-react"

export interface ScoreDisplayProps {
  score: number
  streak?: number
  attempts?: number
  maxAttempts?: number
  round?: number
  totalRounds?: number
  highScore?: number
}

export default function ScoreDisplay({
  score,
  streak,
  attempts,
  maxAttempts,
  round,
  totalRounds,
  highScore,
}: ScoreDisplayProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3 font-mono text-xs shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-1.5 font-bold text-neutral-950 dark:text-neutral-50">
        <Trophy className="h-4 w-4 text-amber-500" />
        <span>Score: {score} XP</span>
      </div>

      {highScore !== undefined && (
        <div className="text-neutral-500 border-l border-neutral-200 pl-3 dark:border-neutral-800">
          <span>Best: {highScore} XP</span>
        </div>
      )}

      {streak !== undefined && streak > 0 && (
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 border-l border-neutral-200 pl-3 dark:border-neutral-800 font-bold">
          <Flame className="h-3.5 w-3.5" />
          <span>Streak: {streak}</span>
        </div>
      )}

      {attempts !== undefined && maxAttempts !== undefined && (
        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 border-l border-neutral-200 pl-3 dark:border-neutral-800">
          <Target className="h-3.5 w-3.5 text-blue-500" />
          <span>
            Attempt: {attempts}/{maxAttempts}
          </span>
        </div>
      )}

      {round !== undefined && totalRounds !== undefined && (
        <div className="text-neutral-500 border-l border-neutral-200 pl-3 dark:border-neutral-800">
          <span>
            Round: {round}/{totalRounds}
          </span>
        </div>
      )}
    </div>
  )
}
