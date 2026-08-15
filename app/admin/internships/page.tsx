"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Star,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { InternshipItem, CmsStore } from "@/lib/cms"

export default function InternshipAdminPage() {
  const [internships, setInternships] = React.useState<InternshipItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("All")

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Partial<InternshipItem> | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchInternships = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setInternships(data.internships || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchInternships()
  }, [fetchInternships])

  const handleOpenAddModal = () => {
    setEditingItem({
      title: "",
      department: "Engineering",
      description: "",
      responsibilities: ["Participate in daily agile standups.", "Develop Next.js components."],
      requirements: ["Familiarity with React and TypeScript.", "Strong problem-solving skills."],
      skills: ["React", "TypeScript", "Tailwind CSS"],
      duration: "3 - 6 Months",
      location: "San Francisco, CA / Remote",
      workType: "Remote",
      deadline: "2026-10-30",
      vacancies: 2,
      status: "Open",
      applicationLink: "mailto:careers@olinethra.com?subject=Internship%20Application",
      isFeatured: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: InternshipItem) => {
    setEditingItem({ ...item })
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (item: InternshipItem, newStatus: "Open" | "Closed" | "Draft") => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          entity: "internships",
          data: { ...item, status: newStatus },
        }),
      })
      if (res.ok) {
        fetchInternships()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship position?")) return
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entity: "internships",
          data: { id },
        }),
      })
      if (res.ok) {
        fetchInternships()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem?.title) return
    setIsSubmitting(true)

    try {
      const action = editingItem.id ? "update" : "create"
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          entity: "internships",
          data: editingItem,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingItem(null)
        fetchInternships()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredInternships = internships.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "All" || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ TALENT MANAGEMENT ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Internship Opportunities
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Changes made here update the public Careers page & AI Chatbot in real-time.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Internship Position
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-neutral-400" />
            {["All", "Open", "Closed", "Draft"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors ${
                  filterStatus === st
                    ? "bg-neutral-950 font-bold text-white dark:bg-neutral-100 dark:text-neutral-950"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Internships List */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading internships...</div>
        ) : filteredInternships.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No internships found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredInternships.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition-all dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-950 dark:text-neutral-50">{item.title}</h3>
                    {item.isFeatured && (
                      <span className="flex items-center gap-1 rounded bg-neutral-950 px-2 py-0.5 font-mono text-[10px] font-bold text-white dark:bg-neutral-100 dark:text-neutral-950">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </span>
                    )}
                    <span
                      className={`rounded px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        item.status === "Open"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : item.status === "Closed"
                          ? "bg-red-500/10 text-red-600 border border-red-500/30"
                          : "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-neutral-500">
                    <span>Dept: {item.department}</span>
                    <span>•</span>
                    <span>Work: {item.workType}</span>
                    <span>•</span>
                    <span>Duration: {item.duration}</span>
                    <span>•</span>
                    <span>Deadline: {item.deadline}</span>
                    <span>•</span>
                    <span>Vacancies: {item.vacancies}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t border-neutral-100 md:border-0 pt-3 md:pt-0 dark:border-neutral-800">
                  {/* Status Toggle Quick Buttons */}
                  <select
                    value={item.status}
                    onChange={(e) => handleToggleStatus(item, e.target.value as any)}
                    className="h-8 rounded-lg border border-neutral-300 bg-white px-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="Open">Status: Open</option>
                    <option value="Closed">Status: Closed</option>
                    <option value="Draft">Status: Draft</option>
                  </select>

                  <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(item)} className="h-8 text-xs">
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
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
          <DialogContent className="max-w-2xl w-[92vw] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-base uppercase font-bold">
                {editingItem?.id ? "Edit Internship Position" : "Create Internship Position"}
              </DialogTitle>
            </DialogHeader>

            {editingItem && (
              <form onSubmit={handleSave} className="space-y-4 py-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Title *</Label>
                    <Input
                      value={editingItem.title || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="e.g. Full Stack Web Development Intern"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Department</Label>
                    <Input
                      value={editingItem.department || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, department: e.target.value })}
                      placeholder="Engineering"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Work Type</Label>
                    <select
                      value={editingItem.workType || "Remote"}
                      onChange={(e) => setEditingItem({ ...editingItem, workType: e.target.value as any })}
                      className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Status</Label>
                    <select
                      value={editingItem.status || "Open"}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                      className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Duration</Label>
                    <Input
                      value={editingItem.duration || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                      placeholder="3 - 6 Months"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Application Deadline</Label>
                    <Input
                      type="date"
                      value={editingItem.deadline || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, deadline: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Description</Label>
                  <Textarea
                    rows={3}
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder="Provide a detailed description..."
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Application Link / Email URL</Label>
                  <Input
                    value={editingItem.applicationLink || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, applicationLink: e.target.value })}
                    placeholder="mailto:careers@olinethra.com"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={editingItem.isFeatured ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="rounded border-neutral-300"
                  />
                  <Label htmlFor="isFeatured" className="text-xs font-mono cursor-pointer">
                    Feature on Careers Homepage
                  </Label>
                </div>

                <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="text-xs bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {isSubmitting ? "Saving..." : "Save Position"}
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
