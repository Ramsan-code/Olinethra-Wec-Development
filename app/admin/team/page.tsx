"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Users, Plus, Edit, Trash2, Search, ArrowUpDown, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { TeamMemberItem, CmsStore } from "@/lib/cms"

export default function TeamAdminPage() {
  const [team, setTeam] = React.useState<TeamMemberItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Partial<TeamMemberItem> | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchTeam = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setTeam(data.team || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  const handleOpenAddModal = () => {
    setEditingItem({
      name: "",
      role: "Software Engineer",
      department: "Engineering",
      bio: "Passionate engineer building high-performance web applications.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      skills: ["Next.js", "TypeScript", "Tailwind CSS"],
      displayOrder: team.length + 1,
      status: "Active",
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: TeamMemberItem) => {
    setEditingItem({ ...item })
    setIsModalOpen(true)
  }

  const handleToggleActive = async (item: TeamMemberItem) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active"
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          entity: "team",
          data: { ...item, status: nextStatus },
        }),
      })
      if (res.ok) fetchTeam()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member from the database?")) return
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entity: "team",
          data: { id },
        }),
      })
      if (res.ok) fetchTeam()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem?.name) return
    setIsSubmitting(true)

    try {
      const action = editingItem.id ? "update" : "create"
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          entity: "team",
          data: editingItem,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingItem(null)
        fetchTeam()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredTeam = team.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ TEAM MANAGEMENT ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Team Members
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Manage public engineering & leadership profiles. Updates sync with public Team page.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Team Member
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search team member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
          />
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading team members...</div>
        ) : filteredTeam.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No team members found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 space-y-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="h-14 w-14 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-neutral-950 dark:text-neutral-50 truncate">{member.name}</h3>
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                          member.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    <p className="font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">{member.role}</p>
                    <span className="text-[10px] font-mono text-neutral-400">Order: #{member.displayOrder}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{member.bio}</p>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(member)}
                    className="h-8 text-xs font-mono"
                  >
                    {member.status === "Active" ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Show
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(member)} className="h-8 text-xs">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
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
          <DialogContent className="max-w-xl w-[92vw] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-base uppercase font-bold">
                {editingItem?.id ? "Edit Team Member" : "Add Team Member"}
              </DialogTitle>
            </DialogHeader>

            {editingItem && (
              <form onSubmit={handleSave} className="space-y-4 py-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Full Name *</Label>
                    <Input
                      value={editingItem.name || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Job Title *</Label>
                    <Input
                      value={editingItem.role || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                      placeholder="Full Stack Developer"
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
                  <Label className="text-xs font-mono">Profile Photo URL</Label>
                  <Input
                    value={editingItem.photoUrl || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, photoUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Short Biography</Label>
                  <Textarea
                    rows={3}
                    value={editingItem.bio || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                    placeholder="Short summary of skills & background..."
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Skills (comma-separated)</Label>
                  <Input
                    value={Array.isArray(editingItem.skills) ? editingItem.skills.join(", ") : editingItem.skills || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Next.js, TypeScript, Node.js, Tailwind CSS"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">LinkedIn URL</Label>
                    <Input
                      value={editingItem.linkedin || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">GitHub URL</Label>
                    <Input
                      value={editingItem.github || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Medium URL (Founder Blog)</Label>
                    <Input
                      value={editingItem.medium || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, medium: e.target.value })}
                      placeholder="https://medium.com/@..."
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Portfolio URL</Label>
                    <Input
                      value={editingItem.portfolio || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, portfolio: e.target.value })}
                      placeholder="https://example.com"
                      className="text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Contact Email</Label>
                    <Input
                      value={editingItem.email || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                      placeholder="dev@olinethra.com"
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="text-xs bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {isSubmitting ? "Saving..." : "Save Member"}
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
