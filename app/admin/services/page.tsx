"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Layers, Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ServiceCMSItem, CmsStore } from "@/lib/cms"

export default function ServicesAdminPage() {
  const [services, setServices] = React.useState<ServiceCMSItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Partial<ServiceCMSItem> | null>(null)
  const [featuresInput, setFeaturesInput] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const fetchServices = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setServices(data.services || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleOpenAddModal = () => {
    setEditingItem({
      title: "",
      shortDesc: "",
      fullDesc: "",
      iconName: "Code2",
      features: ["Feature 1", "Feature 2"],
      deliverables: ["Deliverable 1"],
      displayOrder: services.length + 1,
      status: "Active",
    })
    setFeaturesInput("Feature 1, Feature 2")
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: ServiceCMSItem) => {
    setEditingItem({ ...item })
    setFeaturesInput(item.features?.join("\n") || "")
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (item: ServiceCMSItem) => {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active"
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          entity: "services",
          data: { ...item, status: nextStatus },
        }),
      })
      if (res.ok) fetchServices()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entity: "services",
          data: { id },
        }),
      })
      if (res.ok) fetchServices()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem?.title) return
    setIsSubmitting(true)

    const featureArray = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean)

    const payload = {
      ...editingItem,
      features: featureArray,
    }

    try {
      const action = editingItem.id ? "update" : "create"
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          entity: "services",
          data: payload,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setEditingItem(null)
        fetchServices()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ SERVICES MANAGEMENT ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Technical Services
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Manage capabilities shown on the public Services page & consumed by the AI Chatbot.
            </p>
          </div>

          <Button onClick={handleOpenAddModal} className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <Plus className="h-4 w-4 mr-1.5" />
            Add New Service
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
          />
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No services found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-neutral-500">
                      Icon: {item.iconName || "Code2"}
                    </span>
                    <span
                      className={`rounded px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        item.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-neutral-950 dark:text-neutral-50">{item.title}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{item.shortDesc}</p>

                  <div className="space-y-1 pt-2">
                    <p className="font-mono text-[10px] uppercase text-neutral-400">Key Features:</p>
                    <ul className="list-disc list-inside text-xs text-neutral-700 dark:text-neutral-300 space-y-0.5">
                      {item.features?.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <Button variant="outline" size="sm" onClick={() => handleToggleStatus(item)} className="h-8 text-xs font-mono">
                    {item.status === "Active" ? "Set Inactive" : "Set Active"}
                  </Button>

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
          <DialogContent className="max-w-xl w-[92vw] sm:w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-base uppercase font-bold">
                {editingItem?.id ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>

            {editingItem && (
              <form onSubmit={handleSave} className="space-y-4 py-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Service Title *</Label>
                    <Input
                      value={editingItem.title || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="Web Development"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-mono">Icon Name</Label>
                    <Input
                      value={editingItem.iconName || "Code2"}
                      onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
                      placeholder="Code2 / Layout / Server / ShoppingBag / Cpu / Zap"
                      className="text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Short Summary Description</Label>
                  <Textarea
                    rows={2}
                    value={editingItem.shortDesc || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, shortDesc: e.target.value })}
                    placeholder="Concise overview sentence..."
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Full Detailed Description</Label>
                  <Textarea
                    rows={3}
                    value={editingItem.fullDesc || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, fullDesc: e.target.value })}
                    placeholder="Comprehensive capability breakdown..."
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-mono">Features List (One feature per line)</Label>
                  <Textarea
                    rows={4}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="Custom Next.js & React App Architecture&#10;Server-side Rendering & Static Generation&#10;API Integration & Backend Connectivity"
                    className="text-xs font-mono"
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="text-xs bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
                    {isSubmitting ? "Saving..." : "Save Service"}
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
