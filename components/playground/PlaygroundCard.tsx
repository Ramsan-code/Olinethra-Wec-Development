import * as React from "react"
import Link from "next/link"
import DifficultyBadge from "./DifficultyBadge"
import { ArrowRight, Clock, Gamepad2 } from "lucide-react"

export interface PlaygroundCardProps {
  title: string
  description: string
  category: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  estTime: string
  href: string
  icon?: React.ReactNode
  badgeText?: string
}

export default function PlaygroundCard({
  title,
  description,
  category,
  difficulty,
  estTime,
  href,
  icon,
  badgeText,
}: PlaygroundCardProps) {
  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="rounded bg-neutral-100 px-2 py-0.5 uppercase font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 text-[10px]">
            {category}
          </span>
          <div className="flex items-center gap-2">
            {badgeText && (
              <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] text-purple-600 dark:text-purple-300">
                {badgeText}
              </span>
            )}
            <DifficultyBadge difficulty={difficulty} />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800">
            {icon || <Gamepad2 className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 font-mono text-xs">
        <span className="flex items-center gap-1 text-neutral-500 text-[11px]">
          <Clock className="h-3 w-3" />
          <span>{estTime}</span>
        </span>

        <Link
          href={href}
          className="inline-flex items-center gap-1.5 font-bold text-neutral-950 dark:text-neutral-50 group-hover:translate-x-1 transition-transform"
        >
          <span>Play Challenge</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
