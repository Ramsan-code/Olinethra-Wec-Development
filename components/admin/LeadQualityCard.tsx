"use client"

import { useState } from "react"
import { Sparkles, Brain, CheckCircle2, HelpCircle, RefreshCw, AlertTriangle, Info } from "lucide-react"

export interface LeadMlPrediction {
  status: "COLLECTING_DATA" | "READY" | "ACTIVE" | "DEGRADED" | "DISABLED"
  conversionProbability?: number | null
  completenessScore: number
  scoreBand: "LOW" | "MEDIUM" | "HIGH"
  modelVersion?: string
  algorithm?: string
  confidence?: string
  notice?: string | null
  explanation?: {
    positiveSignals: string[]
    negativeSignals: string[]
    uncertainSignals: string[]
  }
}

interface LeadQualityCardProps {
  leadId: string
  ml?: LeadMlPrediction
  onRescored?: () => void
}

export function LeadQualityCard({ leadId, ml, onRescored }: LeadQualityCardProps) {
  const [rescoring, setRescoring] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleRescore = async () => {
    setRescoring(true)
    setErrorMsg("")
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/score`, { method: "POST" })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to rescore lead")
      }
      if (onRescored) onRescored()
    } catch (err: any) {
      setErrorMsg(err.message || "Rescoring error")
    } finally {
      setRescoring(false)
    }
  }

  if (!ml) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <Brain className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Lead Intelligence</span>
          </div>
          <button
            onClick={handleRescore}
            disabled={rescoring}
            className="flex items-center gap-1 text-xs text-purple-400 hover:underline disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${rescoring ? "animate-spin" : ""}`} />
            Evaluate
          </button>
        </div>
      </div>
    )
  }

  const isDataCollection = ml.status === "COLLECTING_DATA" || ml.conversionProbability === null || ml.conversionProbability === undefined

  const bandColors = {
    HIGH: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    LOW: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400 border border-purple-500/20">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
              Lead Intelligence & Scoring
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${
                  isDataCollection
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                {isDataCollection ? "ML Status: DATA COLLECTION" : "ML Status: MODEL ACTIVE"}
              </span>
            </h4>
            <p className="text-xs text-neutral-400">
              Advisory decision-support signal for team sales prioritization
            </p>
          </div>
        </div>

        <button
          onClick={handleRescore}
          disabled={rescoring}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${rescoring ? "animate-spin" : ""}`} />
          {rescoring ? "Rescoring..." : "Rescore"}
        </button>
      </div>

      {errorMsg && (
        <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-neutral-950/60 rounded-lg p-3.5 border border-neutral-800/80">
        <div>
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
            {isDataCollection ? "Lead Completeness" : "Conversion Likelihood"}
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1 mt-0.5">
            {isDataCollection ? (
              <>
                <span>{ml.completenessScore}%</span>
                <span className="text-xs font-normal text-neutral-400">(Deterministic)</span>
              </>
            ) : (
              <>
                <span className="text-purple-400">{ml.conversionProbability}%</span>
                <span className="text-xs font-normal text-neutral-400">probability</span>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Priority Band</div>
          <div className="mt-1">
            <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md border ${bandColors[ml.scoreBand || "LOW"]}`}>
              {ml.scoreBand} PRIORITY
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">Engine / Model</div>
          <div className="text-xs text-neutral-300 font-mono mt-1">
            {ml.algorithm || (isDataCollection ? "Completeness Evaluator" : "Logistic Regression")}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">
            {ml.modelVersion || "lead-conversion-v1"}
          </div>
        </div>
      </div>

      {/* Data Collection Notice */}
      {isDataCollection && ml.notice && (
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-300/90 flex items-start gap-2.5">
          <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold block text-amber-300 mb-0.5">Data Collection Phase Active</span>
            {ml.notice}
          </div>
        </div>
      )}

      {/* Signal Explanations */}
      {ml.explanation && (
        <div className="space-y-2.5 pt-1">
          {ml.explanation.positiveSignals && ml.explanation.positiveSignals.length > 0 && (
            <div>
              <div className="text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Positive Signals
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {ml.explanation.positiveSignals.map((sig, i) => (
                  <li key={i} className="text-xs text-neutral-300 bg-neutral-950/40 rounded px-2.5 py-1 border border-neutral-800/50 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {sig}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ml.explanation.uncertainSignals && ml.explanation.uncertainSignals.length > 0 && (
            <div>
              <div className="text-xs font-medium text-amber-400 mb-1 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" /> Uncertain / Missing Signals
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {ml.explanation.uncertainSignals.map((sig, i) => (
                  <li key={i} className="text-xs text-neutral-400 bg-neutral-950/40 rounded px-2.5 py-1 border border-neutral-800/50 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    {sig}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
