"use client"

import * as React from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { ArrowLeft, FolderTree, Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InsightCategoryItem } from "@/lib/insights"

export default function InsightCategoriesPage() {
  const [categories, setCategories] = React.useState<InsightCategoryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [displayOrder, setDisplayOrder] = React.useState(0)
  const [creating, setCreating] = React.useState(false)

  const fetchCategories = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/insights/categories")
      if (res.ok) {
        const body = await res.json()
        setCategories(body.data || [])
      }
    } catch (err) {
      console.error("Failed to load categories:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setCreating(true)
    try {
      const res = await fetch("/api/admin/insights/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, displayOrder }),
      })
      const body = await res.json()
      if (res.ok && body.success) {
        setName("")
        setDescription("")
        setDisplayOrder(0)
        fetchCategories()
      } else {
        alert(body.error?.message || "Failed to create category")
      }
    } catch {
      alert("Error creating category")
    } finally {
      setCreating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <Button asChild variant="outline" size="icon" className="h-8 w-8">
            <Link href="/admin/insights">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">[ CATEGORY MANAGER ]</span>
            <h1 className="text-2xl font-black text-neutral-950 dark:text-neutral-50">Insight Categories</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Create Form */}
          <div className="md:col-span-5 space-y-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300">
              Add New Category
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">Category Name *</label>
                <Input
                  placeholder="e.g. Cloud & Infrastructure"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 p-2 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">Display Order</label>
                <Input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="text-xs font-mono"
                />
              </div>

              <Button type="submit" disabled={creating} className="w-full font-mono text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Create Category</span>
              </Button>
            </form>
          </div>

          {/* List Categories */}
          <div className="md:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300">
              Existing Categories ({categories.length})
            </h3>

            {loading ? (
              <div className="p-6 text-center font-mono text-xs text-neutral-500">Loading categories...</div>
            ) : (
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {categories.map((c) => (
                  <div key={c.id} className="py-3 flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <span>{c.name}</span>
                        <span className="font-mono text-[10px] text-neutral-400">/insights?category={c.slug}</span>
                      </div>
                      {c.description && <p className="text-[11px] text-neutral-500 mt-0.5">{c.description}</p>}
                    </div>
                    <span className="font-mono text-[10px] rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
                      Order: {c.displayOrder}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
