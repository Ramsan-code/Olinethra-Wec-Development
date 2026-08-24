"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { ArrowLeft, Sparkles, Save, Send, CheckCircle2, ShieldAlert, Code2, Bot, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InsightCategoryItem, InsightPostItem } from "@/lib/insights"

export default function AiCreateInsightPage() {
  const router = useRouter()
  const [categories, setCategories] = React.useState<InsightCategoryItem[]>([])
  const [generating, setGenerating] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // AI Prompt Inputs
  const [topic, setTopic] = React.useState("")
  const [type, setType] = React.useState<"ARTICLE" | "TECH_BRIEF">("ARTICLE")
  const [audience, setAudience] = React.useState<"CLIENTS" | "DEVELOPERS" | "BOTH">("BOTH")
  const [categoryName, setCategoryName] = React.useState("AI & Automation")
  const [tone, setTone] = React.useState("Professional, technically credible, and practical")
  const [keyPointsInput, setKeyPointsInput] = React.useState(
    "Key engineering practices\nPractical real-world benefits\nHuman oversight & review"
  )
  const [optionalSources, setOptionalSources] = React.useState("")
  const [additionalInstructions, setAdditionalInstructions] = React.useState("")

  // Generated Draft Output State
  const [draftResult, setDraftResult] = React.useState<{
    title: string
    excerpt: string
    content: string
    suggestedCategory: string
    suggestedTags: string[]
    seoTitle: string
    seoDescription: string
    suggestedCTA: "CLIENTS" | "DEVELOPERS" | "BOTH"
  } | null>(null)

  React.useEffect(() => {
    fetch("/api/admin/insights/categories")
      .then((res) => res.json())
      .then((body) => {
        if (body.success && Array.isArray(body.data)) {
          setCategories(body.data)
        }
      })
      .catch((err) => console.error("Failed to load categories:", err))
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter an article topic.")
      return
    }

    setGenerating(true)
    setDraftResult(null)

    try {
      const keyPoints = keyPointsInput
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean)

      const payload = {
        topic,
        type,
        audience,
        categoryName,
        tone,
        keyPoints,
        optionalSources,
        additionalInstructions,
      }

      const res = await fetch("/api/admin/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const body = await res.json()
      if (res.ok && body.success && body.data) {
        setDraftResult(body.data)
      } else {
        alert(body.error?.message || "Failed to generate AI draft.")
      }
    } catch {
      alert("Error invoking Gemini API.")
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveDraft = async (status: "DRAFT" | "PUBLISHED") => {
    if (!draftResult) return

    setSaving(true)
    try {
      const catObj = categories.find((c) => c.name.toLowerCase() === draftResult.suggestedCategory.toLowerCase())
      const selectedCategory = catObj ? catObj.id : categories[0]?.id

      const slug = draftResult.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const payload = {
        title: draftResult.title,
        slug,
        excerpt: draftResult.excerpt,
        content: draftResult.content,
        type,
        authorship: "AI", // Transparent Gemini AI authorship
        authorName: "Olinethra AI",
        authorRole: "Generated with Gemini · Reviewed by Olinethra Team",
        ai: {
          provider: "GEMINI",
          model: "gemini-2.0-flash",
          generatedAt: new Date().toISOString(),
          promptSummary: topic,
        },
        category: selectedCategory,
        tags: draftResult.suggestedTags,
        audience: draftResult.suggestedCTA,
        status, // Always DRAFT unless admin intentionally clicks Publish
        seo: {
          title: draftResult.seoTitle,
          description: draftResult.seoDescription,
        },
      }

      const res = await fetch("/api/admin/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const body = await res.json()
      if (res.ok && body.success) {
        alert(body.message || `AI Draft saved as ${status}!`)
        router.push("/admin/insights")
      } else {
        alert(body.error?.message || "Failed to save AI draft.")
      }
    } catch {
      alert("Error saving AI draft.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link href="/admin/insights">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                <span>[ GEMINI 2.0 FLASH WORKFLOW ]</span>
              </div>
              <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50">
                Create Insight with Gemini AI
              </h1>
            </div>
          </div>
        </div>

        {/* Informational Banner */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-xs space-y-1">
          <div className="flex items-center gap-2 font-mono font-bold text-purple-700 dark:text-purple-300">
            <ShieldAlert className="h-4 w-4" />
            <span>Human-in-the-Loop Safeguard Policy</span>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Gemini creates structured article drafts based on your topic and key points. Generated content is saved as a <strong>DRAFT</strong> and requires human review and explicit approval before public publication.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Generator Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-500" />
              <span>Generation Parameters</span>
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Article Topic / Title Idea *</label>
              <Input
                placeholder="e.g. How AI can help small businesses automate repetitive work"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-md border border-neutral-200 bg-white p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <option value="ARTICLE">Article</option>
                  <option value="TECH_BRIEF">Tech Brief</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">Target Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full rounded-md border border-neutral-200 bg-white p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <option value="BOTH">Both Clients & Devs</option>
                  <option value="CLIENTS">Potential Clients</option>
                  <option value="DEVELOPERS">Devs & Interns</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-500 mb-1">Suggested Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full rounded-md border border-neutral-200 bg-white p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
              >
                <option value="AI & Automation">AI & Automation</option>
                <option value="Engineering">Engineering</option>
                <option value="Web Development">Web Development</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Business Technology">Business Technology</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="Careers & Internships">Careers & Internships</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-500 mb-1">Tone & Voice</label>
              <Input value={tone} onChange={(e) => setTone(e.target.value)} className="text-xs" />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-500 mb-1">Key Points (One per line)</label>
              <textarea
                rows={4}
                value={keyPointsInput}
                onChange={(e) => setKeyPointsInput(e.target.value)}
                className="w-full rounded-md border border-neutral-200 p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-500 mb-1">Optional Sources / References</label>
              <Input
                placeholder="https://..."
                value={optionalSources}
                onChange={(e) => setOptionalSources(e.target.value)}
                className="text-xs"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full font-mono text-xs gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {generating ? (
                <>
                  <Code2 className="h-4 w-4 animate-spin" />
                  <span>Gemini is generating draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Draft with Gemini AI</span>
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Generated Output & Review Panel (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {!draftResult ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-950 space-y-3">
                <Sparkles className="h-10 w-10 text-purple-400 animate-pulse" />
                <h4 className="font-mono text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  Ready to Generate AI Draft
                </h4>
                <p className="text-xs text-neutral-500 max-w-md">
                  Fill in the topic and parameters on the left, then click <strong>Generate Draft with Gemini AI</strong>.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 font-mono text-[10px] text-purple-600 dark:text-purple-300">
                      Generated Gemini Draft
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400">Status: DRAFT</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveDraft("DRAFT")}
                      disabled={saving}
                      className="font-mono text-xs gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save as Draft</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleSaveDraft("PUBLISHED")}
                      disabled={saving}
                      className="font-mono text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Approve & Publish</span>
                    </Button>
                  </div>
                </div>

                {/* Editable Fields for AI Draft */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Title</label>
                    <Input
                      value={draftResult.title}
                      onChange={(e) => setDraftResult({ ...draftResult, title: e.target.value })}
                      className="font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Excerpt</label>
                    <textarea
                      rows={2}
                      value={draftResult.excerpt}
                      onChange={(e) => setDraftResult({ ...draftResult, excerpt: e.target.value })}
                      className="w-full rounded-md border border-neutral-200 p-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Generated Content (Markdown)</label>
                    <textarea
                      rows={12}
                      value={draftResult.content}
                      onChange={(e) => setDraftResult({ ...draftResult, content: e.target.value })}
                      className="w-full rounded-md border border-neutral-200 p-3 font-mono text-xs leading-relaxed dark:border-neutral-800 dark:bg-neutral-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-neutral-500">Category:</span> {draftResult.suggestedCategory}
                    </div>
                    <div>
                      <span className="text-neutral-500">CTA Audience:</span> {draftResult.suggestedCTA}
                    </div>
                    <div className="col-span-2">
                      <span className="text-neutral-500">Suggested Tags:</span> {draftResult.suggestedTags.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
