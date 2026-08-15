"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Image as ImageIcon, Upload, Search, Trash2, Copy, Check, Filter, ExternalLink, Video } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MediaItem {
  id: string
  name: string
  url: string
  type: "image" | "video"
  category: "project" | "team" | "logo" | "hero"
  size: string
  uploadedAt: string
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "med-1",
    name: "finovate-dashboard-preview.png",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
    type: "image",
    category: "project",
    size: "420 KB",
    uploadedAt: "2026-08-15",
  },
  {
    id: "med-2",
    name: "aura-fashion-storefront.png",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    type: "image",
    category: "project",
    size: "610 KB",
    uploadedAt: "2026-08-14",
  },
  {
    id: "med-3",
    name: "showcase-intro-engineering.mp4",
    url: "https://assets.mixkit.co/videos/preview/mixkit-code-animation-web-development-41656-large.mp4",
    type: "video",
    category: "hero",
    size: "2.4 MB",
    uploadedAt: "2026-08-15",
  },
  {
    id: "med-4",
    name: "lead-engineer-photo.jpg",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
    type: "image",
    category: "team",
    size: "310 KB",
    uploadedAt: "2026-08-10",
  },
]

export default function MediaAdminPage() {
  const [items, setItems] = React.useState<MediaItem[]>(INITIAL_MEDIA)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterType, setFilterType] = React.useState<"All" | "image" | "video">("All")
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [newUrl, setNewUrl] = React.useState("")
  const [newName, setNewName] = React.useState("")
  const [newType, setNewType] = React.useState<"image" | "video">("image")

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUrl || !newName) return
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      name: newName,
      url: newUrl,
      type: newType,
      category: "project",
      size: "URL External",
      uploadedAt: new Date().toISOString().split("T")[0],
    }
    setItems([newItem, ...items])
    setNewUrl("")
    setNewName("")
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this asset record?")) return
    setItems(items.filter((i) => i.id !== id))
  }

  const filtered = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "All" || item.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ MEDIA ASSET LIBRARY ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Media &amp; Asset Management
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Centralized repository for project screenshots, showcase videos, team photos, and brand assets.
            </p>
          </div>
        </div>

        {/* Add Asset Form */}
        <form onSubmit={handleAddMedia} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 space-y-3">
          <h2 className="font-mono text-xs uppercase font-bold text-neutral-950 dark:text-neutral-50 flex items-center gap-1.5">
            <Upload className="h-4 w-4" /> Add Media Asset URL
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <Input
              placeholder="Asset Name (e.g. hero-banner.jpg)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="sm:col-span-4 text-xs h-9"
            />
            <Input
              placeholder="Asset URL (https://...)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="sm:col-span-5 text-xs h-9"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="sm:col-span-2 text-xs h-9 rounded-lg border border-neutral-300 bg-white px-2 font-mono dark:border-neutral-700 dark:bg-neutral-950"
            >
              <option value="image">Type: Image</option>
              <option value="video">Type: Video</option>
            </select>
            <Button type="submit" size="sm" className="sm:col-span-1 h-9 text-xs bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
              Save
            </Button>
          </div>
        </form>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search asset filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto font-mono text-xs">
            {(["All", "image", "video"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`rounded-lg px-3 py-1 uppercase transition-colors ${
                  filterType === t
                    ? "bg-neutral-950 font-bold text-white dark:bg-neutral-100 dark:text-neutral-950"
                    : "border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-between"
            >
              <div className="aspect-video relative bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden">
                {item.type === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.url} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-neutral-400">
                    <Video className="h-8 w-8" />
                    <span className="font-mono text-[10px]">VIDEO ASSET</span>
                  </div>
                )}
                <span className="absolute top-2 left-2 rounded bg-neutral-950/80 px-2 py-0.5 font-mono text-[9px] uppercase text-white backdrop-blur">
                  {item.type}
                </span>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-neutral-950 dark:text-neutral-50 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <span className="font-mono text-[10px] text-neutral-400">{item.size}</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(item.id, item.url)}
                    className="flex-1 text-[11px] font-mono h-7 border-neutral-200 dark:border-neutral-800"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600 mr-1" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" /> Copy URL
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-7 w-7 text-neutral-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
