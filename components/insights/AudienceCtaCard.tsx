"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Briefcase, GraduationCap, Code2, Rocket, Building2 } from "lucide-react"

export interface AudienceCtaCardProps {
  postId?: string
  audience: "CLIENTS" | "DEVELOPERS" | "BOTH"
}

export default function AudienceCtaCard({ postId, audience }: AudienceCtaCardProps) {
  const [activeTab, setActiveTab] = React.useState<"CLIENTS" | "DEVELOPERS">(
    audience === "DEVELOPERS" ? "DEVELOPERS" : "CLIENTS"
  )

  const handleCtaClick = () => {
    if (postId) {
      fetch(`/api/insights/${postId}/cta-click`, { method: "POST" }).catch(() => null)
    }
  }

  return (
    <div className="my-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-900/80 shadow-sm space-y-6">
      {audience === "BOTH" && (
        <div className="flex justify-center">
          <div className="flex rounded-lg border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-950 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("CLIENTS")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 transition-all ${
                activeTab === "CLIENTS"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>For Enterprise & Clients</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("DEVELOPERS")}
              className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 transition-all ${
                activeTab === "DEVELOPERS"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>For Engineers & Applicants</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "CLIENTS" && (
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <Rocket className="h-4 w-4 text-emerald-500" />
            <span>[ OLINETHRA ENGINEERING STUDIO ]</span>
          </div>

          <h3 className="text-2xl font-black text-neutral-950 dark:text-neutral-50">
            Build Modern, High-Performance Web Software
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Need custom web application development, AI integrations, or Next.js performance optimization? Partner with Olinethra to build fast, scalable digital products.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              href="/#contact"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-6 py-3 font-mono text-xs font-bold text-white transition-all hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <span>Request Project Proposal</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/#services"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 font-mono text-xs font-bold text-neutral-800 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <span>Explore Services</span>
            </Link>
          </div>
        </div>
      )}

      {activeTab === "DEVELOPERS" && (
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
            <Code2 className="h-4 w-4 text-blue-500" />
            <span>[ CAREERS & INTERNSHIPS ]</span>
          </div>

          <h3 className="text-2xl font-black text-neutral-950 dark:text-neutral-50">
            Join the Olinethra Engineering Studio
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Are you passionate about clean TypeScript code, Next.js architecture, and practical AI applications? Explore full-time roles and mentorship internships.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              href="/#internships"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-6 py-3 font-mono text-xs font-bold text-white transition-all hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Apply for Internship</span>
            </Link>

            <Link
              href="/#jobs"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 font-mono text-xs font-bold text-neutral-800 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Briefcase className="h-4 w-4" />
              <span>View Open Roles</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
