"use client"

import * as React from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  BookOpen,
  Plus,
  Sparkles,
  Newspaper,
  FolderTree,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Archive,
  Bot,
  User,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InsightPostItem, InsightCategoryItem } from "@/lib/insights"

export default function AdminInsightsPage() {
  const [posts, setPosts] = React.useState<InsightPostItem[]>([])
  const [categories, setCategories] = React.useState<InsightCategoryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("")
  const [authorshipFilter, setAuthorshipFilter] = React.useState("")
  const [audienceFilter, setAudienceFilter] = React.useState("")
  const [actionMessage, setActionMessage] = React.useState<string | null>(null)

  const fetchPosts = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      if (typeFilter) params.set("type", typeFilter)
      if (categoryFilter) params.set("category", categoryFilter)
      if (authorshipFilter) params.set("authorship", authorshipFilter)
      if (audienceFilter) params.set("audience", audienceFilter)

      const [postsRes, catRes] = await Promise.all([
        fetch(`/api/admin/insights?${params.toString()}`),
        fetch("/api/admin/insights/categories"),
      ])

      if (postsRes.ok) {
        const body = await postsRes.json()
        setPosts(body.data || [])
      }

      if (catRes.ok) {
        const catBody = await catRes.json()
        setCategories(catBody.data || [])
      }
    } catch (err) {
      console.error("Failed to load insights:", err)
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, typeFilter, categoryFilter, authorshipFilter, audienceFilter])

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/insights/${id}/publish`, { method: "POST" })
      const body = await res.json()
      if (res.ok) {
        setActionMessage(body.message || "Article published!")
        fetchPosts()
      } else {
        alert(body.error?.message || "Failed to publish article")
      }
    } catch {
      alert("Failed to publish article")
    }
  }

  const handleUnpublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/insights/${id}/unpublish`, { method: "POST" })
      const body = await res.json()
      if (res.ok) {
        setActionMessage(body.message || "Article unpublished.")
        fetchPosts()
      }
    } catch {
      alert("Failed to unpublish article")
    }
  }

  const handleArchive = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/insights/${id}/archive`, { method: "POST" })
      const body = await res.json()
      if (res.ok) {
        setActionMessage(body.message || "Article archived.")
        fetchPosts()
      }
    } catch {
      alert("Failed to archive article")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this insight post?")) return
    try {
      const res = await fetch(`/api/admin/insights/${id}`, { method: "DELETE" })
      if (res.ok) {
        setActionMessage("Article deleted.")
        fetchPosts()
      }
    } catch {
      alert("Failed to delete article")
    }
  }

  // Stats calculation
  const totalPosts = posts.length
  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length
  const draftsCount = posts.filter((p) => p.status === "DRAFT" || p.status === "REVIEW").length
  const techBriefsCount = posts.filter((p) => p.type === "TECH_BRIEF").length
  const aiAssistedCount = posts.filter((p) => p.authorship === "AI" || p.authorship === "HUMAN_AI").length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span>[ PUBLISHING SYSTEM ]</span>
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl text-neutral-950 dark:text-neutral-50">
              Olinethra Insights
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Manage human articles, Gemini drafts, Tech Briefs, and publishing lifecycle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="default" className="gap-1.5 font-mono text-xs">
              <Link href="/admin/insights/new">
                <Plus className="h-3.5 w-3.5" />
                <span>Write Article</span>
              </Link>
            </Button>

            <Button asChild size="sm" variant="secondary" className="gap-1.5 font-mono text-xs border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500/20">
              <Link href="/admin/insights/ai-create">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                <span>Create with AI</span>
              </Link>
            </Button>

            <Button asChild size="sm" variant="outline" className="gap-1.5 font-mono text-xs">
              <Link href="/admin/insights/tech-briefs">
                <Newspaper className="h-3.5 w-3.5" />
                <span>Tech Briefs</span>
              </Link>
            </Button>

            <Button asChild size="sm" variant="ghost" className="gap-1.5 font-mono text-xs">
              <Link href="/admin/insights/categories">
                <FolderTree className="h-3.5 w-3.5" />
                <span>Categories</span>
              </Link>
            </Button>
          </div>
        </div>

        {actionMessage && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="underline text-[10px]">Dismiss</button>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="font-mono text-[11px] uppercase">Total Posts</span>
              <FileText className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-black">{totalPosts}</p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="font-mono text-[11px] uppercase">Published</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-black">{publishedCount}</p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
              <span className="font-mono text-[11px] uppercase">Drafts & Review</span>
              <Clock className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-black">{draftsCount}</p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
              <span className="font-mono text-[11px] uppercase">Tech Briefs</span>
              <Newspaper className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-black">{techBriefsCount}</p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
              <span className="font-mono text-[11px] uppercase">AI Assisted</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-black">{aiAssistedCount}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by title, excerpt, slug, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="REVIEW">Review</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <option value="">All Types</option>
                <option value="ARTICLE">Article</option>
                <option value="TECH_BRIEF">Tech Brief</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={authorshipFilter}
                onChange={(e) => setAuthorshipFilter(e.target.value)}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <option value="">All Authorship</option>
                <option value="HUMAN">Human</option>
                <option value="AI">Gemini AI</option>
                <option value="HUMAN_AI">Human + AI</option>
              </select>

              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                <option value="">All Audiences</option>
                <option value="CLIENTS">Clients</option>
                <option value="DEVELOPERS">Developers</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
          {loading ? (
            <div className="p-12 text-center font-mono text-xs text-neutral-500">
              Loading insights data...
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <BookOpen className="mx-auto h-8 w-8 text-neutral-400" />
              <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                No insight posts found
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Create a human article, generate a Gemini draft, or create a Tech Brief to get started.
              </p>
              <div className="flex justify-center gap-2 pt-2">
                <Button asChild size="sm">
                  <Link href="/admin/insights/new">Write First Article</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/admin/insights/ai-create">Create with Gemini AI</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 bg-neutral-50 font-mono uppercase text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Title & Metadata</th>
                    <th className="px-4 py-3 font-semibold">Type & Category</th>
                    <th className="px-4 py-3 font-semibold">Authorship</th>
                    <th className="px-4 py-3 font-semibold">Audience</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Metrics</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {posts.map((post) => {
                    const categoryName = typeof post.category === "object" ? post.category?.name : post.categoryName || "Engineering"
                    return (
                      <tr key={post.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                        {/* Title */}
                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-bold text-neutral-900 dark:text-neutral-100 truncate" title={post.title}>
                            {post.title}
                          </div>
                          <div className="font-mono text-[10px] text-neutral-400 truncate mt-0.5">
                            /insights/{post.slug}
                          </div>
                        </td>

                        {/* Type & Category */}
                        <td className="px-4 py-3 whitespace-nowrap space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                              post.type === "TECH_BRIEF"
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            }`}>
                              {post.type}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-neutral-500">{categoryName}</div>
                        </td>

                        {/* Authorship */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {post.authorship === "HUMAN" && (
                            <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                              <User className="h-3 w-3" />
                              <span>Human ({post.authorName || "Team"})</span>
                            </span>
                          )}
                          {post.authorship === "AI" && (
                            <span className="inline-flex items-center gap-1 rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] text-purple-600 dark:text-purple-300" title="Generated by Gemini, pending human approval">
                              <Sparkles className="h-3 w-3 text-purple-500" />
                              <span>Gemini AI</span>
                            </span>
                          )}
                          {post.authorship === "HUMAN_AI" && (
                            <span className="inline-flex items-center gap-1 rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 font-mono text-[10px] text-blue-600 dark:text-blue-300">
                              <Bot className="h-3 w-3 text-blue-500" />
                              <span>Human + AI</span>
                            </span>
                          )}
                        </td>

                        {/* Audience */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="rounded border border-neutral-200 px-2 py-0.5 font-mono text-[10px] dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
                            {post.audience}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                            post.status === "PUBLISHED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : post.status === "REVIEW"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                              : post.status === "ARCHIVED"
                              ? "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                              : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30"
                          }`}>
                            {post.status}
                          </span>
                        </td>

                        {/* Metrics */}
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-neutral-500">
                          <div>👁️ {post.views || 0} views</div>
                          <div>🎯 {post.ctaClicks || 0} CTA clicks</div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {post.status === "PUBLISHED" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[10px] font-mono text-amber-600"
                                onClick={() => handleUnpublish(post.id)}
                                title="Unpublish back to draft"
                              >
                                Unpublish
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="default"
                                className="h-7 px-2 text-[10px] font-mono bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handlePublish(post.id)}
                                title="Publish article"
                              >
                                Publish
                              </Button>
                            )}

                            <Button asChild size="sm" variant="outline" className="h-7 w-7 p-0" title="Edit Article">
                              <Link href={`/admin/insights/${post.id}/edit`}>
                                <Edit className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            {post.status === "PUBLISHED" && (
                              <Button asChild size="sm" variant="ghost" className="h-7 w-7 p-0" title="View Public Article">
                                <Link href={`/insights/${post.slug}`} target="_blank">
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                              onClick={() => handleDelete(post.id)}
                              title="Delete Post"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
