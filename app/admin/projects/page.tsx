"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { FolderGit2, Plus, Edit, Trash2, Search, Star, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ProjectCMSItem, CmsStore } from "@/lib/cms"

export default function ProjectsAdminPage() {
  const [projects, setProjects] = React.useState<ProjectCMSItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [techInput, setTechInput] = React.useState("")

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Partial<ProjectCMSItem> | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchProjects = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleOpenAddModal = () => {
    setEditingItem({
      title: "",
      client: "Acme Corp",
      category: "Web Application",
      description: "",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
      gallery: [],
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      projectUrl: "https://example.com",
      caseStudy: "Full technical case study detailing architecture, database schemas, and metrics...",
      isFeatured: true,
      displayOrder: projects.length + 1,
      status: "Published",
    })
    setTechInput("Next.js, TypeScript, Tailwind CSS, PostgreSQL")
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: ProjectCMSItem) => {
    setEditingItem({ ...item })
    setTechInput(item.technologies?.join(", ") || "")
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (item: ProjectCMSItem, newStatus: "Published" | "Draft") => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          entity: "projects",
          data: { ...item, status: newStatus },
        }),
      })
      if (res.ok) fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entity: "projects",
          data: { id },
        }),
      })
      if (res.ok) fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem?.title) return
    setIsSubmitting(true)

    const techArray = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      ...editingItem,
      technologies: techArray,
    }

    try {
      const action = editingItem.id ? "update" : "create"
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          entity: "projects",
          data: payload,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingItem(null)
        fetchProjects()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ PORTFOLIO MANAGEMENT ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Projects & Case Studies
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Add, edit, or publish client projects. Updates sync dynamically across all portfolio pages.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Project
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
          />
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-neutral-500">{item.category}</span>
                      {item.isFeatured && (
                        <span className="flex items-center gap-1 rounded bg-neutral-950 px-2 py-0.5 font-mono text-[9px] font-bold text-white dark:bg-neutral-100 dark:text-neutral-950">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        item.status === "Published"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-950 dark:text-neutral-50">{item.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {item.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <select
                    value={item.status}
                    onChange={(e) => handleToggleStatus(item, e.target.value as any)}
                    className="h-8 rounded-lg border border-neutral-300 bg-white px-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="Published">Status: Published</option>
                    <option value="Draft">Status: Draft</option>
                  </select>

                  <div className="flex items-center gap-1">
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
              </div>
            ))}
          </div>
        )}

        {/* Modal Dialog Form */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl w-[92vw] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-base uppercase font-bold">
                {editingItem?.id ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>

            {editingItem && (
              <form onSubmit={handleSave} className="space-y-4 py-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Project Name *</Label>
                    <Input
                      value={editingItem.title || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="Fintech SaaS Platform"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Client Name</Label>
                    <Input
                      value={editingItem.client || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                      placeholder="Finova Technologies"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Category</Label>
                    <Input
                      value={editingItem.category || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      placeholder="SaaS Analytics / E-Commerce"
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Status</Label>
                    <select
                      value={editingItem.status || "Published"}
                      onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                      className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-xs dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Technologies (comma separated)</Label>
                  <Input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Next.js, React, TypeScript, PostgreSQL"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Short Description</Label>
                  <Textarea
                    rows={2}
                    value={editingItem.description || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder="Overview summary..."
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Full Case Study Details</Label>
                  <Textarea
                    rows={4}
                    value={editingItem.caseStudy || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, caseStudy: e.target.value })}
                    placeholder="Technical breakdown, challenges solved, results achieved..."
                    className="text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Thumbnail Image URL</Label>
                    <Input
                      value={editingItem.thumbnail || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, thumbnail: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Live Demo URL</Label>
                    <Input
                      value={editingItem.projectUrl || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, projectUrl: e.target.value })}
                      placeholder="https://..."
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="projectFeatured"
                    checked={editingItem.isFeatured ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="rounded border-neutral-300"
                  />
                  <Label htmlFor="projectFeatured" className="text-xs font-mono cursor-pointer">
                    Feature on Homepage Portfolio Grid
                  </Label>
                </div>

                <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="text-xs bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {isSubmitting ? "Saving..." : "Save Project"}
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
