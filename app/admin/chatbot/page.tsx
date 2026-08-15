"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Bot, Plus, Edit, Trash2, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ChatbotKnowledgeItem, CmsStore } from "@/lib/cms"

export default function ChatbotAdminPage() {
  const [knowledgeItems, setKnowledgeItems] = React.useState<ChatbotKnowledgeItem[]>([])
  const [loading, setLoading] = React.useState(true)

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Partial<ChatbotKnowledgeItem> | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchKnowledge = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setKnowledgeItems(data.chatbotKnowledge || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchKnowledge()
  }, [fetchKnowledge])

  const handleOpenAddModal = () => {
    setEditingItem({
      topic: "Custom Knowledge",
      question: "",
      answer: "",
      category: "General",
      lastUpdated: new Date().toISOString().split("T")[0],
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: ChatbotKnowledgeItem) => {
    setEditingItem({ ...item })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this chatbot knowledge item?")) return
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entity: "chatbotKnowledge",
          data: { id },
        }),
      })
      if (res.ok) fetchKnowledge()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem?.question || !editingItem?.answer) return
    setIsSubmitting(true)

    const payload = {
      ...editingItem,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    try {
      const action = editingItem.id ? "update" : "create"
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          entity: "chatbotKnowledge",
          data: payload,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingItem(null)
        fetchKnowledge()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ AI KNOWLEDGE BASE ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Chatbot Knowledge Base
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Add or update custom Q&amp;A context for the AI Assistant. Synced in real-time without modifying code.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Knowledge Item
          </Button>
        </div>

        {/* Live Sync Banner */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold text-neutral-950 dark:text-neutral-50">
                Dynamic CMS Knowledge Sync Active
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                The chatbot also automatically consumes all published Internships, Jobs, Services, Team, and FAQs!
              </p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-xs font-mono text-emerald-600 font-semibold">
            <CheckCircle2 className="h-4 w-4" /> Live Connected
          </span>
        </div>

        {/* Knowledge List */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading knowledge base...</div>
        ) : knowledgeItems.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No custom knowledge items added.</div>
        ) : (
          <div className="space-y-4">
            {knowledgeItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-neutral-500">
                      Topic: {item.topic}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Updated: {item.lastUpdated}</span>
                  </div>

                  <h3 className="font-bold text-sm text-neutral-950 dark:text-neutral-50">Q: &ldquo;{item.question}&rdquo;</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">A: {item.answer}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t border-neutral-100 sm:border-0 pt-2 sm:pt-0 dark:border-neutral-800">
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
                {editingItem?.id ? "Edit Chatbot Knowledge" : "Add Knowledge Item"}
              </DialogTitle>
            </DialogHeader>

            {editingItem && (
              <form onSubmit={handleSave} className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label className="text-xs font-mono">Topic / Category</Label>
                  <Input
                    value={editingItem.topic || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, topic: e.target.value })}
                    placeholder="e.g. Pricing, Security, Technical Stack"
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">User Question or Query *</Label>
                  <Input
                    value={editingItem.question || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                    placeholder="e.g. What is Olinethra's policy on code ownership?"
                    required
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Chatbot Answer Response *</Label>
                  <Textarea
                    rows={4}
                    value={editingItem.answer || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                    placeholder="Provide exact response information..."
                    required
                    className="text-xs"
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="text-xs bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {isSubmitting ? "Saving..." : "Save Knowledge"}
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
