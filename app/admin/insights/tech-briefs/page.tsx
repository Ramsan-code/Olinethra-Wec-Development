"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { ArrowLeft, Newspaper, Sparkles, Save, Send, Link as LinkIcon, Info, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InsightCategoryItem } from "@/lib/insights"

export default function TechBriefsAdminPage() {
  const router = useRouter()
  const [categories, setCategories] = React.useState<InsightCategoryItem[]>([])
  const [generating, setGenerating] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  // Source inputs
  const [headline, setHeadline] = React.useState("")
  const [sourceUrl, setSourceUrl] = React.useState("")
  const [sourceName, setSourceName] = React.useState("")
  const [rawSourceText, setRawSourceText] = React.useState("")
  const [customNotes, setCustomNotes] = React.useState("")

  // Output State
  const [techBriefResult, setTechBriefResult] = React.useState<{
    title: string
    excerpt: string
    whatHappened: string
    whyItMatters: string
    whoShouldCare: string
    olinethraCommentary: string
    suggestedCategory: string
    suggestedTags: string[]
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
    if (!rawSourceText.trim() && !headline.trim() && !sourceUrl.trim()) {
      alert("Please provide at least a source headline, URL, or source text.")
      return
    }

    setGenerating(true)
    setTechBriefResult(null)

    try {
      const payload = {
        headline,
        sourceUrl,
        sourceName,
        rawSourceText,
        customNotes,
      }

      const res = await fetch("/api/admin/insights/generate-tech-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const body = await res.json()
      if (res.ok && body.success && body.data) {
        setTechBriefResult(body.data)
      } else {
        alert(body.error?.message || "Failed to generate Tech Brief.")
      }
    } catch {
      alert("Error invoking Tech Brief generator.")
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveTechBrief = async (status: "DRAFT" | "PUBLISHED") => {
    if (!techBriefResult) return

    setSaving(true)
    try {
      const catObj = categories.find((c) => c.name.toLowerCase() === techBriefResult.suggestedCategory.toLowerCase())
      const selectedCategory = catObj ? catObj.id : categories[0]?.id

      const slug = techBriefResult.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const formattedContent = `## What Happened?
${techBriefResult.whatHappened}

## Why It Matters
${techBriefResult.whyItMatters}

## Who Should Care?
${techBriefResult.whoShouldCare}

## Olinethra Commentary
${techBriefResult.olinethraCommentary}`

      const payload = {
        title: techBriefResult.title,
        slug,
        excerpt: techBriefResult.excerpt,
        content: formattedContent,
        type: "TECH_BRIEF",
        authorship: "HUMAN_AI",
        authorName: "Olinethra Engineering Team",
        authorRole: "Curated Industry Insights",
        category: selectedCategory,
        tags: techBriefResult.suggestedTags,
        audience: "BOTH",
        status,
        source: {
          name: sourceName || "Industry News",
          url: sourceUrl,
          whatHappened: techBriefResult.whatHappened,
          whyItMatters: techBriefResult.whyItMatters,
          whoShouldCare: techBriefResult.whoShouldCare,
          commentary: techBriefResult.olinethraCommentary,
        },
      }

      const res = await fetch("/api/admin/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const body = await res.json()
      if (res.ok && body.success) {
        alert(body.message || `Tech Brief saved as ${status}!`)
        router.push("/admin/insights")
      } else {
        alert(body.error?.message || "Failed to save Tech Brief.")
      }
    } catch {
      alert("Error saving Tech Brief.")
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
              <div className="flex items-center gap-1.5 font-mono text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                <Newspaper className="h-3.5 w-3.5" />
                <span>[ CURATED TECH BRIEFS ]</span>
              </div>
              <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50">
                Curate Technology Brief
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Source Material Input */}
          <div className="lg:col-span-5 space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-blue-500" />
              <span>Source Information</span>
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Headline / News Title</label>
              <Input
                placeholder="e.g. Next.js 16 Released with React 19 Support"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Source URL</label>
              <Input
                placeholder="https://nextjs.org/blog/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Source Publication / Brand</label>
              <Input
                placeholder="e.g. Vercel Blog / Google AI"
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Raw News Text / Excerpt</label>
              <textarea
                rows={5}
                placeholder="Paste original announcement snippet or article highlights..."
                value={rawSourceText}
                onChange={(e) => setRawSourceText(e.target.value)}
                className="w-full rounded-md border border-neutral-200 p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Olinethra Commentary Preference</label>
              <textarea
                rows={2}
                placeholder="e.g. Highlight our view on Server Components adoption and performance gains..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full rounded-md border border-neutral-200 p-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full font-mono text-xs gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {generating ? (
                <>
                  <Code2 className="h-4 w-4 animate-spin" />
                  <span>Curating Brief with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Tech Brief</span>
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Structured Brief Review */}
          <div className="lg:col-span-7 space-y-4">
            {!techBriefResult ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-950 space-y-3">
                <Newspaper className="h-10 w-10 text-blue-400" />
                <h4 className="font-mono text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  Ready to Curate Tech Brief
                </h4>
                <p className="text-xs text-neutral-500 max-w-md">
                  Provide headline or source links on the left, then click <strong>Generate Tech Brief</strong> to extract key takeaways and engineering commentary.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
                  <span className="rounded bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 font-mono text-[10px] text-blue-600 dark:text-blue-300">
                    Structured Tech Brief
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSaveTechBrief("DRAFT")}
                      disabled={saving}
                      className="font-mono text-xs gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Draft</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleSaveTechBrief("PUBLISHED")}
                      disabled={saving}
                      className="font-mono text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Publish Brief</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Tech Brief Title</label>
                    <Input
                      value={techBriefResult.title}
                      onChange={(e) => setTechBriefResult({ ...techBriefResult, title: e.target.value })}
                      className="font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">What Happened?</label>
                    <textarea
                      rows={3}
                      value={techBriefResult.whatHappened}
                      onChange={(e) => setTechBriefResult({ ...techBriefResult, whatHappened: e.target.value })}
                      className="w-full rounded-md border border-neutral-200 p-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Why It Matters</label>
                    <textarea
                      rows={3}
                      value={techBriefResult.whyItMatters}
                      onChange={(e) => setTechBriefResult({ ...techBriefResult, whyItMatters: e.target.value })}
                      className="w-full rounded-md border border-neutral-200 p-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Who Should Care?</label>
                    <textarea
                      rows={2}
                      value={techBriefResult.whoShouldCare}
                      onChange={(e) => setTechBriefResult({ ...techBriefResult, whoShouldCare: e.target.value })}
                      className="w-full rounded-md border border-neutral-200 p-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Olinethra Commentary</label>
                    <textarea
                      rows={4}
                      value={techBriefResult.olinethraCommentary}
                      onChange={(e) => setTechBriefResult({ ...techBriefResult, olinethraCommentary: e.target.value })}
                      className="w-full rounded-md border border-neutral-200 p-3 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    />
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
