"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  ArrowLeft,
  Save,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User,
  Eye,
  RefreshCw,
  Code2,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InsightCategoryItem, InsightPostItem } from "@/lib/insights"

export default function EditInsightPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [categories, setCategories] = React.useState<InsightCategoryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [aiAssisting, setAiAssisting] = React.useState(false)

  // Article State
  const [title, setTitle] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [excerpt, setExcerpt] = React.useState("")
  const [content, setContent] = React.useState("")
  const [type, setType] = React.useState<"ARTICLE" | "TECH_BRIEF">("ARTICLE")
  const [authorship, setAuthorship] = React.useState<"HUMAN" | "AI" | "HUMAN_AI">("HUMAN")
  const [authorName, setAuthorName] = React.useState("")
  const [authorRole, setAuthorRole] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [tagsInput, setTagsInput] = React.useState("")
  const [audience, setAudience] = React.useState<"CLIENTS" | "DEVELOPERS" | "BOTH">("BOTH")
  const [status, setStatus] = React.useState<"DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED">("DRAFT")
  const [featured, setFeatured] = React.useState(false)
  const [coverImageUrl, setCoverImageUrl] = React.useState("")
  const [coverImageAlt, setCoverImageAlt] = React.useState("")
  const [seoTitle, setSeoTitle] = React.useState("")
  const [seoDescription, setSeoDescription] = React.useState("")

  // AI Assist Sidebar State
  const [aiAction, setAiAction] = React.useState<
    "IMPROVE_WRITING" | "FIX_GRAMMAR" | "MAKE_CONCISE" | "EXPAND" | "GENERATE_EXAMPLE" | "SUGGEST_HEADING" | "IMPROVE_SEO" | "CREATE_EXCERPT"
  >("IMPROVE_WRITING")
  const [aiInputText, setAiInputText] = React.useState("")
  const [aiSuggestion, setAiSuggestion] = React.useState("")

  React.useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [postRes, catRes] = await Promise.all([
          fetch(`/api/admin/insights/${id}`),
          fetch("/api/admin/insights/categories"),
        ])

        if (catRes.ok) {
          const catBody = await catRes.json()
          setCategories(catBody.data || [])
        }

        if (postRes.ok) {
          const postBody = await postRes.json()
          const p: InsightPostItem = postBody.data
          if (p) {
            setTitle(p.title || "")
            setSlug(p.slug || "")
            setExcerpt(p.excerpt || "")
            setContent(p.content || "")
            setType(p.type || "ARTICLE")
            setAuthorship(p.authorship || "HUMAN")
            setAuthorName(p.authorName || "")
            setAuthorRole(p.authorRole || "")
            setCategory(typeof p.category === "object" ? p.category?._id || "" : p.category || "")
            setTagsInput(Array.isArray(p.tags) ? p.tags.join(", ") : "")
            setAudience(p.audience || "BOTH")
            setStatus(p.status || "DRAFT")
            setFeatured(Boolean(p.featured))
            setCoverImageUrl(p.coverImage?.url || "")
            setCoverImageAlt(p.coverImage?.alt || "")
            setSeoTitle(p.seo?.title || p.title || "")
            setSeoDescription(p.seo?.description || p.excerpt || "")
          }
        }
      } catch (err) {
        console.error("Failed to load insight post:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadData()
  }, [id])

  const handleUpdate = async (newStatus?: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    setSaving(true)
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const targetStatus = newStatus || status

      const payload = {
        title,
        slug,
        excerpt,
        content,
        type,
        authorship,
        authorName,
        authorRole,
        category,
        tags,
        audience,
        status: targetStatus,
        featured,
        coverImage: coverImageUrl ? { url: coverImageUrl, alt: coverImageAlt } : undefined,
        seo: {
          title: seoTitle || title,
          description: seoDescription || excerpt,
        },
      }

      const res = await fetch(`/api/admin/insights/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const body = await res.json()
      if (res.ok && body.success) {
        alert(body.message || "Article updated successfully!")
        if (newStatus) setStatus(newStatus)
      } else {
        alert(body.error?.message || "Failed to update article.")
      }
    } catch {
      alert("Error updating article.")
    } finally {
      setSaving(false)
    }
  }

  const handleRunAiAssist = async () => {
    const textToAssist = aiInputText.trim() || content.slice(0, 500)
    if (!textToAssist) {
      alert("Please enter or highlight text to send to AI Assist.")
      return
    }

    setAiAssisting(true)
    setAiSuggestion("")

    try {
      const res = await fetch(`/api/admin/insights/${id}/ai-assist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: aiAction,
          text: textToAssist,
          contextTitle: title,
        }),
      })

      const body = await res.json()
      if (res.ok && body.success && body.data?.result) {
        setAiSuggestion(body.data.result)
      } else {
        alert(body.error?.message || "AI assist failed.")
      }
    } catch {
      alert("Error invoking AI assist.")
    } finally {
      setAiAssisting(false)
    }
  }

  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion) return
    if (aiAction === "CREATE_EXCERPT") {
      setExcerpt(aiSuggestion)
    } else if (aiAction === "IMPROVE_SEO") {
      setSeoDescription(aiSuggestion)
    } else {
      // Append or replace content section
      if (aiInputText.trim() && content.includes(aiInputText.trim())) {
        setContent(content.replace(aiInputText.trim(), aiSuggestion))
      } else {
        setContent((prev) => `${prev}\n\n${aiSuggestion}`)
      }
    }
    // Update authorship transparently to HUMAN_AI
    if (authorship === "HUMAN") {
      setAuthorship("HUMAN_AI")
    }
    alert("Applied AI suggestion to article! Authorship set to Human + AI.")
  }

  // Pre-Publish Quality Checklist logic
  const checkTitle = Boolean(title.trim())
  const checkExcerpt = Boolean(excerpt.trim())
  const checkContent = Boolean(content.trim())
  const checkAuthorship = Boolean(authorship)
  const isReadyToPublish = checkTitle && checkExcerpt && checkContent && checkAuthorship

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center font-mono text-xs text-neutral-500">
          Loading article editor...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link href="/admin/insights">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase">
                <span>[ EDIT INSIGHT ARTICLE ]</span>
                <span className="rounded px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-[10px]">{status}</span>
              </div>
              <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50 truncate max-w-xl">
                {title || "Edit Article"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleUpdate("DRAFT")} disabled={saving} className="gap-1.5 font-mono text-xs">
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </Button>

            {status === "PUBLISHED" ? (
              <Button variant="secondary" size="sm" onClick={() => handleUpdate("DRAFT")} disabled={saving} className="gap-1.5 font-mono text-xs text-amber-600">
                <span>Unpublish</span>
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={() => handleUpdate("PUBLISHED")} disabled={saving || !isReadyToPublish} className="gap-1.5 font-mono text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="h-3.5 w-3.5" />
                <span>Publish Now</span>
              </Button>
            )}
          </div>
        </div>

        {/* Quality Checklist Banner */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 font-mono font-bold text-neutral-700 dark:text-neutral-300">
            <FileCheck className="h-4 w-4 text-emerald-500" />
            <span>Pre-Publish Quality Checklist:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px]">
            <span className={`flex items-center gap-1 ${checkTitle ? "text-emerald-600" : "text-amber-500"}`}>
              {checkTitle ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />} Title
            </span>
            <span className={`flex items-center gap-1 ${checkExcerpt ? "text-emerald-600" : "text-amber-500"}`}>
              {checkExcerpt ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />} Excerpt
            </span>
            <span className={`flex items-center gap-1 ${checkContent ? "text-emerald-600" : "text-amber-500"}`}>
              {checkContent ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />} Content
            </span>
            <span className={`flex items-center gap-1 ${checkAuthorship ? "text-emerald-600" : "text-amber-500"}`}>
              {checkAuthorship ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />} Authorship Disclosure ({authorship})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Article Editor (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="font-bold text-sm" />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Slug</label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="font-mono text-xs" />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Excerpt</label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Content (Markdown)</label>
                <textarea
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 p-4 font-mono text-xs leading-relaxed dark:border-neutral-800 dark:bg-neutral-950"
                />
              </div>
            </div>

            {/* Metadata Settings */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300">
                Article Metadata & SEO
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-neutral-500 mb-1">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full rounded border p-2 dark:bg-neutral-950">
                    <option value="ARTICLE">Article</option>
                    <option value="TECH_BRIEF">Tech Brief</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 mb-1">Authorship Disclosure</label>
                  <select value={authorship} onChange={(e) => setAuthorship(e.target.value as any)} className="w-full rounded border p-2 dark:bg-neutral-950">
                    <option value="HUMAN">Human Author</option>
                    <option value="AI">Gemini AI</option>
                    <option value="HUMAN_AI">Human + AI Collaborative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 mb-1">Author Name</label>
                  <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="text-xs" />
                </div>

                <div>
                  <label className="block text-neutral-500 mb-1">Target Audience</label>
                  <select value={audience} onChange={(e) => setAudience(e.target.value as any)} className="w-full rounded border p-2 dark:bg-neutral-950">
                    <option value="BOTH">Both</option>
                    <option value="CLIENTS">Clients</option>
                    <option value="DEVELOPERS">Developers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right AI Assist Sidebar (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-purple-600 dark:text-purple-300 uppercase">
                <Sparkles className="h-4 w-4" />
                <span>Gemini Editorial AI Assistant</span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">Choose Editorial Action</label>
                <select
                  value={aiAction}
                  onChange={(e) => setAiAction(e.target.value as any)}
                  className="w-full rounded-md border border-neutral-200 bg-white p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <option value="IMPROVE_WRITING">Polish & Improve Clarity</option>
                  <option value="FIX_GRAMMAR">Fix Grammar & Typos</option>
                  <option value="MAKE_CONCISE">Make Concise</option>
                  <option value="EXPAND">Expand Section</option>
                  <option value="GENERATE_EXAMPLE">Add Code Snippet / Example</option>
                  <option value="SUGGEST_HEADING">Suggest Headings</option>
                  <option value="IMPROVE_SEO">Optimize for SEO Keywords</option>
                  <option value="CREATE_EXCERPT">Generate Crisp Excerpt</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">Target Text / Paragraph (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="Paste specific section or leave empty to use article text..."
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
                />
              </div>

              <Button
                onClick={handleRunAiAssist}
                disabled={aiAssisting}
                className="w-full font-mono text-xs gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {aiAssisting ? (
                  <>
                    <Code2 className="h-4 w-4 animate-spin" />
                    <span>Gemini processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Run AI Assist</span>
                  </>
                )}
              </Button>

              {aiSuggestion && (
                <div className="rounded-lg border border-purple-500/30 bg-white p-4 space-y-3 dark:bg-neutral-900">
                  <span className="font-mono text-[10px] uppercase text-purple-600 font-bold">AI Suggestion:</span>
                  <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {aiSuggestion}
                  </div>
                  <Button
                    size="sm"
                    onClick={handleApplyAiSuggestion}
                    className="w-full font-mono text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Apply Suggestion to Article</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
