"use client"

import * as React from "react"
import { Sparkles, User, Bot, Info, ShieldCheck } from "lucide-react"

export interface AuthorshipBadgeProps {
  authorship: "HUMAN" | "AI" | "HUMAN_AI"
  authorName?: string
  authorRole?: string
  aiInfo?: {
    provider?: string
    model?: string
    reviewedBy?: string
  }
}

export default function AuthorshipBadge({
  authorship,
  authorName = "Olinethra Team",
  authorRole = "Engineering Studio",
  aiInfo,
}: AuthorshipBadgeProps) {
  const [showModal, setShowModal] = React.useState(false)

  return (
    <>
      <div className="inline-flex items-center gap-2">
        {authorship === "HUMAN" && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-mono text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
            <User className="h-3.5 w-3.5 text-neutral-500" />
            <span>Written by {authorName}</span>
          </div>
        )}

        {authorship === "AI" && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-mono text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>Generated with Gemini AI · Human Reviewed</span>
            <Info className="h-3 w-3 opacity-60 ml-0.5" />
          </button>
        )}

        {authorship === "HUMAN_AI" && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-colors"
          >
            <Bot className="h-3.5 w-3.5 text-blue-500" />
            <span>Human + AI Collaboration</span>
            <Info className="h-3 w-3 opacity-60 ml-0.5" />
          </button>
        )}
      </div>

      {/* AI Disclosure Standards Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Olinethra AI Disclosure Policy</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600 font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              <p>
                At Olinethra, we believe in <strong>100% transparency</strong> in content publication.
              </p>
              <ul className="list-disc pl-4 space-y-1 font-mono text-[11px]">
                <li>
                  <strong>Human-in-the-Loop Review:</strong> Every AI-assisted draft is reviewed and approved by an authenticated Olinethra engineer before publication.
                </li>
                <li>
                  <strong>Zero Autonomous Publishing:</strong> AI models never publish directly to our platform without human sign-off.
                </li>
                <li>
                  <strong>No Invented Claims:</strong> Our AI prompts strictly prohibit inventing client names, enterprise stats, or fictitious software awards.
                </li>
              </ul>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-neutral-900 px-4 py-2 font-mono text-xs font-bold text-white dark:bg-neutral-100 dark:text-neutral-900"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
