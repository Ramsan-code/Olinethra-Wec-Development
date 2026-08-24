"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"

import {
  Brain,
  ShieldCheck,
  Database,
  BarChart3,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Info,
  Lock,
  Layers,
} from "lucide-react"

interface MlStatusData {
  status: "COLLECTING_DATA" | "READY" | "ACTIVE" | "DEGRADED" | "DISABLED"
  isReady: boolean
  totalLeads: number
  totalLabeled: number
  wonCount: number
  lostCount: number
  unresolvedCount: number
  thresholds: {
    minLabeledLeads: number
    minPositiveSamples: number
    minNegativeSamples: number
  }
  activeModel?: {
    modelVersion?: string
    algorithm?: string
    trainedAt?: string
    trainingSamples?: number
    positiveSamples?: number
    negativeSamples?: number
  }
  metrics?: {
    precision?: number
    recall?: number
    f1?: number
    rocAuc?: number
    prAuc?: number
    outperformedBaseline?: boolean
  }
  reasons: string[]
}

export default function MlAnalyticsPage() {
  const [data, setData] = useState<MlStatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/ml/status")
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data)
      }
    } catch (err) {
      console.error("Failed to fetch ML status:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleBatchScore = async () => {
    setActionLoading(true)
    setActionMsg(null)
    try {
      const res = await fetch("/api/admin/leads/batch-score", { method: "POST" })
      const json = await res.json()
      if (res.ok && json.success) {
        setActionMsg({ type: "success", text: json.message || "Batch rescoring completed." })
        fetchStatus()
      } else {
        throw new Error(json.message || "Batch rescore failed.")
      }
    } catch (err: any) {
      setActionMsg({ type: "error", text: err.message || "Error running batch rescore." })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRetrain = async () => {
    setActionLoading(true)
    setActionMsg(null)
    try {
      const res = await fetch("/api/admin/ml/retrain", { method: "POST" })
      const json = await res.json()
      if (res.ok && json.success) {
        setActionMsg({ type: "success", text: json.message || "Model training & evaluation finished." })
        fetchStatus()
      } else {
        throw new Error(json.message || "Training script failed.")
      }
    } catch (err: any) {
      setActionMsg({ type: "error", text: err.message || "Error executing model training." })
    } finally {
      setActionLoading(false)
    }
  }

  const totalLabeled = data?.totalLabeled || 0
  const minRequired = data?.thresholds?.minLabeledLeads || 100
  const progressPercent = Math.min(100, Math.round((totalLabeled / minRequired) * 100))

  return (
    <AdminLayout>

      <div className="space-y-6 max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Lead Conversion Intelligence & ML Control Center</h1>
            </div>
            <p className="text-sm text-neutral-400 mt-1">
              Data-driven decision support signal system for sales lead prioritization and outcome analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchScore}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white transition disabled:opacity-50 border border-neutral-700"
            >
              <RefreshCw className={`h-4 w-4 ${actionLoading ? "animate-spin" : ""}`} />
              Batch Rescore Leads
            </button>

            <button
              onClick={handleRetrain}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition disabled:opacity-50 shadow-lg shadow-purple-600/20"
            >
              <Play className="h-4 w-4 fill-current" />
              Evaluate & Train Model
            </button>
          </div>
        </div>

        {actionMsg && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
              actionMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}
          >
            {actionMsg.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            )}
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 space-y-2">
            <div className="text-xs font-mono uppercase text-neutral-400 flex items-center justify-between">
              <span>ML Model Status</span>
              <Brain className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span
                className={`inline-block text-xs font-semibold uppercase px-2.5 py-1 rounded-full border ${
                  data?.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {data?.status === "ACTIVE" ? "MODEL ACTIVE" : "DATA COLLECTION"}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {data?.status === "ACTIVE"
                ? "Scikit-Learn Predictive Model Active"
                : "Collecting historical outcome labels"}
            </p>
          </div>

          <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 space-y-2">
            <div className="text-xs font-mono uppercase text-neutral-400 flex items-center justify-between">
              <span>Resolved Outcomes</span>
              <Database className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {totalLabeled} <span className="text-xs font-normal text-neutral-400">/ {minRequired} min</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 space-y-2">
            <div className="text-xs font-mono uppercase text-neutral-400 flex items-center justify-between">
              <span>WON vs LOST Ratio</span>
              <BarChart3 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-2">
              <span className="text-emerald-400">{data?.wonCount || 0} WON</span>
              <span className="text-neutral-500 text-sm">/</span>
              <span className="text-rose-400">{data?.lostCount || 0} LOST</span>
            </div>
            <p className="text-xs text-neutral-400">
              Unresolved open leads: {data?.unresolvedCount || 0}
            </p>
          </div>

          <div className="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800 space-y-2">
            <div className="text-xs font-mono uppercase text-neutral-400 flex items-center justify-between">
              <span>Active Model Version</span>
              <Layers className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {data?.activeModel?.modelVersion || "lead-conversion-v1"}
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              {data?.activeModel?.algorithm || "Completeness Evaluator"}
            </p>
          </div>
        </div>

        {/* Readiness Requirements Section */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-400" />
            ML Model Training Readiness Requirements (Section 3)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 space-y-1.5">
              <div className="text-xs text-neutral-400">Minimum Labeled Resolved Leads</div>
              <div className="text-xl font-bold text-white flex items-center justify-between">
                <span>{totalLabeled} / {data?.thresholds?.minLabeledLeads || 100}</span>
                {totalLabeled >= (data?.thresholds?.minLabeledLeads || 100) ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Info className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <p className="text-[11px] text-neutral-500">Requires 100+ resolved outcomes (WON or LOST)</p>
            </div>

            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 space-y-1.5">
              <div className="text-xs text-neutral-400">Minimum Positive Examples (WON)</div>
              <div className="text-xl font-bold text-white flex items-center justify-between">
                <span>{data?.wonCount || 0} / {data?.thresholds?.minPositiveSamples || 25}</span>
                {(data?.wonCount || 0) >= (data?.thresholds?.minPositiveSamples || 25) ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Info className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <p className="text-[11px] text-neutral-500">Requires at least 25 positive WON leads</p>
            </div>

            <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 space-y-1.5">
              <div className="text-xs text-neutral-400">Minimum Negative Examples (LOST)</div>
              <div className="text-xl font-bold text-white flex items-center justify-between">
                <span>{data?.lostCount || 0} / {data?.thresholds?.minNegativeSamples || 25}</span>
                {(data?.lostCount || 0) >= (data?.thresholds?.minNegativeSamples || 25) ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Info className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <p className="text-[11px] text-neutral-500">Requires at least 25 negative LOST leads</p>
            </div>
          </div>

          {data?.reasons && data.reasons.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300 space-y-1">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Data Collection Phase Notes:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-amber-300/80">
                {data.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Model Evaluation Metrics (if trained) */}
        {data?.metrics && (
          <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              Held-Out Evaluation Metrics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono text-center">
              <div className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-400">PRECISION</div>
                <div className="text-lg font-bold text-emerald-400">{data.metrics.precision ?? "N/A"}</div>
              </div>
              <div className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-400">RECALL</div>
                <div className="text-lg font-bold text-blue-400">{data.metrics.recall ?? "N/A"}</div>
              </div>
              <div className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-400">F1 SCORE</div>
                <div className="text-lg font-bold text-purple-400">{data.metrics.f1 ?? "N/A"}</div>
              </div>
              <div className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-400">ROC-AUC</div>
                <div className="text-lg font-bold text-amber-400">{data.metrics.rocAuc ?? "N/A"}</div>
              </div>
              <div className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-400">PR-AUC</div>
                <div className="text-lg font-bold text-teal-400">{data.metrics.prAuc ?? "N/A"}</div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy & Governance Safeguards Box */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Lock className="h-4 w-4 text-rose-400" />
            ML Privacy, Ethics & Data Governance Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-300">
            <div className="bg-neutral-950/40 p-4 rounded-xl border border-neutral-800/60 space-y-2">
              <span className="font-semibold text-neutral-200 block">Strictly Excluded Attributes</span>
              <p className="text-neutral-400">
                The model NEVER ingests protected personal attributes (race, gender, religion, national origin), nor raw PII identifiers like phone numbers, email addresses, or individual full names.
              </p>
            </div>

            <div className="bg-neutral-950/40 p-4 rounded-xl border border-neutral-800/60 space-y-2">
              <span className="font-semibold text-neutral-200 block">Zero Data Leakage Rule</span>
              <p className="text-neutral-400">
                Post-outcome variables (wonDate, contract values, proposal acceptance dates, invoice data) are strictly excluded from feature vectors to prevent target leakage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
