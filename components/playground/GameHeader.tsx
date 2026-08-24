import * as React from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface GameHeaderProps {
  title: string
  subtitle: string
  onReset?: () => void
}

export default function GameHeader({ title, subtitle, onReset }: GameHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="icon" className="h-8 w-8 shrink-0">
          <Link href="/playground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
            <Terminal className="h-3.5 w-3.5" />
            <span>[ OLINETHRA PLAYGROUND ]</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-950 dark:text-neutral-50">
            {title}
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="font-mono text-xs gap-1.5 shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>New Game</span>
        </Button>
      )}
    </div>
  )
}
