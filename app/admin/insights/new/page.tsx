"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { ArrowLeft, Save, Eye, Send, Image as ImageIcon, Sparkles, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InsightCategoryItem } from "@/lib/insights"

export default function WriteArticlePage() {
  const router = useRouter()
  const [categories, setCategories] = React.useState<InsightCategoryItem[]>([])
  const [activeTab, setActiveTab] = React.useState<"edit" | "preview">("edit")
  const [saving, setSaving] = React.useState(false)

  // Form State
  const [title, setTitle] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [excerpt, setExcerpt] = React.useState("")
  const [content, setContent] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [tagsInput, setTagsInput] = React.useState("Next.js, Web Development, Engineering")
  const [audience, setAudience] = React.useState<"CLIENTS" | "DEVELOPERS" | "BOTH">("BOTH")
  const [authorship, setAuthorship] = React.useState<"HUMAN" | "HUMAN_AI">("HUMAN")
  const [authorName, setAuthorName] = React.useState("Olinethra Engineering Team")
  const [authorRole, setAuthorRole] = React.useState("Software Architecture Studio")
  const [coverImageUrl, setCoverImageUrl] = React.useState("")
  const [coverImageAlt, setCoverImageAlt] = React.useState("")
  const [seoTitle, setSeoTitle] = React.useState("")
  const [seoDescription, setSeoDescription] = React.useState("")
  const [featured, setFeatured] = React.useState(false)

  React.useEffect(() => {
    fetch("/api/admin/insights/categories")
      .then((res) => res.json())
      .then((body) => {
        if (body.success && Array.isArray(body.data)) {
          setCategories(body.data)
          if (body.data.length > 0) setCategory(body.data[0].id)
        }
      })
      .catch((err) => console.error("Failed to load categories:", err))
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
    }
  }

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title.trim() || !excerpt.trim()) {
      alert("Please provide both an article title and an excerpt.")
      return
    }

    setSaving(true)
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)

      const payload = {
        title,
        slug,
        excerpt,
        content,
        type: "ARTICLE",
        authorship,
        authorName,
        authorRole,
        category,
        tags,
        audience,
        coverImage: coverImageUrl ? { url: coverImageUrl, alt: coverImageAlt } : undefined,
        status,
        featured,
        seo: {
          title: seoTitle || title,
          description: seoDescription || excerpt,
        },
      }

      const res = await fetch("/api/admin/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const body = await res.json()
      if (res.ok && body.success) {
        alert(body.message || `Article saved as ${status}!`)
        router.push("/admin/insights")
      } else {
        alert(body.error?.message || "Failed to save article.")
      }
    } catch {
      alert("Error saving article.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="icon" className="h-8 w-8">
              <Link href="/admin/insights">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">[ HUMAN ARTICLE WRITER ]</span>
              <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50">Write New Insight Article</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-neutral-200 p-0.5 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  activeTab === "edit" ? "bg-white text-neutral-950 shadow dark:bg-neutral-800 dark:text-neutral-50" : "text-neutral-500"
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 text-xs font-mono rounded ${
                  activeTab === "preview" ? "bg-white text-neutral-950 shadow dark:bg-neutral-800 dark:text-neutral-50" : "text-neutral-500"
                }`}
              >
                Preview
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={() => handleSave("DRAFT")} disabled={saving} className="gap-1.5 font-mono text-xs">
              <Save className="h-3.5 w-3.5" />
              <span>Save Draft</span>
            </Button>

            <Button variant="default" size="sm" onClick={() => handleSave("PUBLISHED")} disabled={saving} className="gap-1.5 font-mono text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              <Send className="h-3.5 w-3.5" />
              <span>Publish Article</span>
            </Button>
          </div>
        </div>

        {activeTab === "preview" ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
            <div className="space-y-2 border-b border-neutral-200 pb-6 dark:border-neutral-800">
              <span className="inline-block font-mono text-xs text-neutral-500 uppercase">
                {categories.find((c) => c.id === category)?.name || "Engineering"}
              </span>
              <h1 className="text-3xl font-black">{title || "Untitled Article"}</h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-base">{excerpt || "No excerpt provided yet."}</p>
              <div className="font-mono text-xs text-neutral-400 pt-2">
                By {authorName} ({authorRole}) • Authorship: {authorship}
              </div>
            </div>

            {coverImageUrl && (
              <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 max-h-80">
                <img src={coverImageUrl} alt={coverImageAlt || title} className="w-full object-cover" />
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
              {content || "Article content will appear here..."}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Article Title *</label>
                  <Input
                    placeholder="e.g. Architecting Scalable Next.js 16 Applications"
                    value={title}
                    onChange={handleTitleChange}
                    className="text-base font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">URL Slug</label>
                  <Input
                    placeholder="architecting-scalable-nextjs-16-applications"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <span className="text-[10px] font-mono text-neutral-400">Public URL: /insights/{slug || "slug-preview"}</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Article Excerpt *</label>
                  <textarea
                    rows={3}
                    placeholder="A concise 2-sentence summary that appears on article cards and search engine results..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-500 mb-1">Article Content (Markdown)</label>
                  <textarea
                    rows={16}
                    placeholder="Write article body in Markdown format... Use ## Headings, code blocks (```ts), lists, and quotes."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 p-4 font-mono text-xs leading-relaxed dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              {/* Cover Image Section */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Cover Image Settings</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Image URL</label>
                    <Input
                      placeholder="https://images.unsplash.com/photo-..."
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-500 mb-1">Alt Text</label>
                    <Input
                      placeholder="Descriptive image alt text for accessibility"
                      value={coverImageAlt}
                      onChange={(e) => setCoverImageAlt(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>

                {coverImageUrl && (
                  <div className="rounded border border-neutral-200 p-2 dark:border-neutral-800 max-h-40 overflow-hidden">
                    <img src={coverImageUrl} alt="Cover preview" className="h-36 w-full object-cover rounded" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Metadata & Controls */}
            <div className="space-y-6">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300">
                  Publishing Settings
                </h3>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">Target Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full rounded-md border border-neutral-200 bg-white p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
                  >
                    <option value="BOTH">Both Clients & Developers</option>
                    <option value="CLIENTS">Potential Clients (Business & Product)</option>
                    <option value="DEVELOPERS">Developers & Interns (Engineering & Careers)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">Authorship</label>
                  <select
                    value={authorship}
                    onChange={(e) => setAuthorship(e.target.value as any)}
                    className="w-full rounded-md border border-neutral-200 bg-white p-2 font-mono text-xs dark:border-neutral-800 dark:bg-neutral-950"
                  >
                    <option value="HUMAN">Human Author</option>
                    <option value="HUMAN_AI">Human + AI Collaborative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">Author Name</label>
                  <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="text-xs" />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">Author Role</label>
                  <Input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} className="text-xs" />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">Tags (comma-separated)</label>
                  <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="text-xs font-mono" />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <label htmlFor="featured" className="text-xs font-mono text-neutral-700 dark:text-neutral-300">
                    Feature on Insights Homepage Banner
                  </label>
                </div>
              </div>

              {/* SEO Settings Card */}
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
                <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300">
                  SEO & Search Metadata
                </h3>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">SEO Title</label>
                  <Input
                    placeholder={title || "Article SEO Title"}
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-500 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    placeholder={excerpt || "Search engine description snippet..."}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 p-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
