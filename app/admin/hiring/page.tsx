"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Briefcase, Plus, Edit, Trash2, Search, Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { JobItem, CmsStore } from "@/lib/cms"

export default function HiringAdminPage() {
  const [jobs, setJobs] = React.useState<JobItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("All")

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Partial<JobItem> | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchJobs = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setJobs(data.jobs || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleOpenAddModal = () => {
    setEditingItem({
      title: "",
      department: "Engineering",
      employmentType: "Full-time",
      location: "San Francisco, CA / Remote",
      workType: "Remote",
      salary: "$120,000 - $150,000 / year",
      description: "",
      responsibilities: ["Lead engineering sprints.", "Review pull requests and enforce TypeScript standards."],
      requirements: ["3+ years experience with Next.js & React.", "Solid software architecture fundamentals."],
      skills: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
      deadline: "2026-11-30",
      applicationUrl: "mailto:careers@olinethra.com?subject=Job%20Application",
      status: "Open",
      isFeatured: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: JobItem) => {
    setEditingItem({ ...item })
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (item: JobItem, newStatus: "Open" | "Paused" | "Closed") => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          entity: "jobs",
          data: { ...item, status: newStatus },
        }),
      })
      if (res.ok) fetchJobs()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job position?")) return
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entity: "jobs",
          data: { id },
        }),
      })
      if (res.ok) fetchJobs()
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
          entity: "jobs",
          data: editingItem,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingItem(null)
        fetchJobs()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredJobs = jobs.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "All" || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ RECRUITMENT CMS ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Hiring / Open Roles
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Manage full-time & contract openings. Changes reflect instantly on the public website.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Job Position
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-neutral-400" />
            {["All", "Open", "Paused", "Closed"].map((st) => (
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

        {/* Jobs List */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading job openings...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No job openings found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredJobs.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 transition-all dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-950 dark:text-neutral-50">{item.title}</h3>
                    <span
                      className={`rounded px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        item.status === "Open"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : item.status === "Paused"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                          : "bg-red-500/10 text-red-600 border border-red-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-neutral-500">
                    <span>Type: {item.employmentType}</span>
                    <span>•</span>
                    <span>Location: {item.location}</span>
                    {item.salary && (
                      <>
                        <span>•</span>
                        <span>Salary: {item.salary}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t border-neutral-100 md:border-0 pt-3 md:pt-0 dark:border-neutral-800">
                  <select
                    value={item.status}
                    onChange={(e) => handleToggleStatus(item, e.target.value as any)}
                    className="h-8 rounded-lg border border-neutral-300 bg-white px-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="Open">Status: Open</option>
                    <option value="Paused">Status: Paused</option>
                    <option value="Closed">Status: Closed</option>
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
                {editingItem?.id ? "Edit Job Position" : "Create Job Position"}
              </DialogTitle>
            </DialogHeader>

            {editingItem && (
              <form onSubmit={handleSave} className="space-y-4 py-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Job Title *</Label>
                    <Input
                      value={editingItem.title || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="e.g. Senior Frontend Engineer"
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
                    <Label className="text-xs font-mono">Employment Type</Label>
                    <select
                      value={editingItem.employmentType || "Full-time"}
                      onChange={(e) => setEditingItem({ ...editingItem, employmentType: e.target.value as any })}
                      className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
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
                      <option value="Paused">Paused</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Salary Range</Label>
                    <Input
                      value={editingItem.salary || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, salary: e.target.value })}
                      placeholder="$120,000 - $150,000 / year"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Location</Label>
                    <Input
                      value={editingItem.location || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                      placeholder="San Francisco, CA / Remote"
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
                    placeholder="Provide role description..."
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Application Email / Link</Label>
                  <Input
                    value={editingItem.applicationUrl || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, applicationUrl: e.target.value })}
                    placeholder="mailto:careers@olinethra.com"
                    className="text-xs font-mono"
                  />
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
