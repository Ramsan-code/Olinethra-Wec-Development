"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { HelpCircle, Plus, Edit, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FAQCMSItem, CmsStore } from "@/lib/cms"

const categories = [
  "All",
  "General",
  "Services",
  "Pricing",
  "Development",
  "Internships",
  "Hiring",
  "Technology",
  "Projects",
]

export default function FAQAdminPage() {
  const [faqs, setFaqs] = React.useState<FAQCMSItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Partial<FAQCMSItem> | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchFaqs = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setFaqs(data.faqs || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  const handleOpenAddModal = () => {
    setEditingItem({
      question: "",
      answer: "",
      category: "General",
      displayOrder: faqs.length + 1,
      published: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: FAQCMSItem) => {
    setEditingItem({ ...item })
    setIsModalOpen(true)
  }

  const handleTogglePublished = async (item: FAQCMSItem) => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          entity: "faqs",
          data: { ...item, published: !item.published },
        }),
      })
      if (res.ok) fetchFaqs()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ entry?")) return
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entity: "faqs",
          data: { id },
        }),
      })
      if (res.ok) fetchFaqs()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem?.question || !editingItem?.answer) return
    setIsSubmitting(true)

    try {
      const action = editingItem.id ? "update" : "create"
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          entity: "faqs",
          data: editingItem,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingItem(null)
        fetchFaqs()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || f.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ FAQ CONTENT CMS ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              FAQ Manager
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Add & categorize FAQ entries. Changes sync with both the public FAQ page & AI Chatbot.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <Plus className="h-4 w-4 mr-1.5" />
            Add FAQ Entry
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search FAQ questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  selectedCategory === cat
                    ? "bg-neutral-950 font-bold text-white dark:bg-neutral-100 dark:text-neutral-950"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading FAQs...</div>
        ) : filteredFaqs.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No FAQ entries found.</div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-neutral-500">
                      Category: {item.category}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                        item.published
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-neutral-950 dark:text-neutral-50">{item.question}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{item.answer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t border-neutral-100 sm:border-0 pt-2 sm:pt-0 dark:border-neutral-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublished(item)}
                    className="h-8 text-xs font-mono"
                  >
                    {item.published ? "Unpublish" : "Publish"}
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(item)} className="h-8 text-xs">
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Dialog Form */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-xl w-[92vw] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-base uppercase font-bold">
                {editingItem?.id ? "Edit FAQ Entry" : "Add FAQ Entry"}
              </DialogTitle>
            </DialogHeader>

            {editingItem && (
              <form onSubmit={handleSave} className="space-y-4 py-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Category</Label>
                    <select
                      value={editingItem.category || "General"}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                      className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      {categories.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Display Order</Label>
                    <Input
                      type="number"
                      value={editingItem.displayOrder ?? 1}
                      onChange={(e) => setEditingItem({ ...editingItem, displayOrder: parseInt(e.target.value) || 1 })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Question *</Label>
                  <Input
                    value={editingItem.question || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                    placeholder="e.g. How long does a project take?"
                    required
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Answer *</Label>
                  <Textarea
                    rows={4}
                    value={editingItem.answer || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                    placeholder="Detailed explanation answer..."
                    required
                    className="text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="faqPublished"
                    checked={editingItem.published ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                    className="rounded border-neutral-300"
                  />
                  <Label htmlFor="faqPublished" className="text-xs font-mono cursor-pointer">
                    Publish immediately to website & AI Chatbot
                  </Label>
                </div>

                <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="text-xs bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {isSubmitting ? "Saving..." : "Save FAQ"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
