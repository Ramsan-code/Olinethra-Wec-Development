"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  FileText,
  ArrowLeft,
  Eye,
  Download,
  Edit2,
  Trash2,
  Calendar,
  Building2,
  User,
  Hash,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Quote {
  id: string
  legacyId: string
  title: string
  clientName?: string
  companyName?: string
  quotationNumber?: string
  quotationDate?: string
  projectName?: string
  notes?: string
  file: {
    url: string
    originalName: string
    format: string
    bytes?: number
  }
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export default function QuoteDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [quote, setQuote] = React.useState<Quote | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Edit Modal State
  const [isEditing, setIsEditing] = React.useState(false)
  const [editForm, setEditForm] = React.useState({
    title: "",
    clientName: "",
    companyName: "",
    quotationNumber: "",
    quotationDate: "",
    projectName: "",
    notes: "",
  })
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Delete Modal State
  const [isDeletingModalOpen, setIsDeletingModalOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const fetchQuote = React.useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/quotes/${id}`)
      const data = await res.json()
      if (res.ok && data?.data?.quote) {
        const item = data.data.quote
        setQuote(item)
        setEditForm({
          title: item.title || "",
          clientName: item.clientName || "",
          companyName: item.companyName || "",
          quotationNumber: item.quotationNumber || "",
          quotationDate: item.quotationDate ? item.quotationDate.split("T")[0] : "",
          projectName: item.projectName || "",
          notes: item.notes || "",
        })
      } else {
        setError(data?.message || "Failed to load quotation details.")
      }
    } catch (err) {
      console.error("[QUOTE DETAILS] Fetch error:", err)
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [id])

  React.useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quote) return

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()
      if (res.ok) {
        setIsEditing(false)
        fetchQuote()
      } else {
        alert(data?.message || "Failed to update quotation.")
      }
    } catch (err) {
      alert("An error occurred during update.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!quote) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/admin/quotes")
      } else {
        const data = await res.json()
        alert(data?.message || "Failed to delete quotation record.")
        setIsDeleting(false)
      }
    } catch (err) {
      alert("An error occurred during deletion.")
      setIsDeleting(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "PDF"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="font-mono text-xs">
              <Link href="/admin/quotes" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Quotes</span>
              </Link>
            </Button>
          </div>

          {quote && (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="font-mono text-xs">
                <a href={`/api/admin/quotes/${quote.id}/view`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>View PDF</span>
                </a>
              </Button>

              <Button asChild variant="outline" size="sm" className="font-mono text-xs">
                <a href={`/api/admin/quotes/${quote.id}/download`} download className="flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </a>
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="font-mono text-xs">
                <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit Metadata
              </Button>

              <Button variant="destructive" size="sm" onClick={() => setIsDeletingModalOpen(true)} className="font-mono text-xs">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-neutral-500 flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent"></span>
            <span>Loading quotation details...</span>
          </div>
        ) : error || !quote ? (
          <div className="p-12 text-center space-y-3 font-mono">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-500" />
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{error || "Quotation record not found"}</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/quotes">Return to Archives</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metadata Sidebar / Overview */}
            <div className="space-y-6">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                      <ShieldCheck className="h-3 w-3" /> Private Document
                    </span>
                    {quote.quotationNumber && (
                      <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-bold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        <Hash className="h-3 w-3 text-neutral-400" />
                        {quote.quotationNumber}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-2 font-mono text-base font-bold text-neutral-950 dark:text-neutral-50">
                    {quote.title}
                  </h1>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 font-mono text-xs">
                  {quote.clientName && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Client Name:
                      </span>
                      <strong className="text-neutral-900 dark:text-neutral-100">{quote.clientName}</strong>
                    </div>
                  )}

                  {quote.companyName && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> Company:
                      </span>
                      <strong className="text-neutral-900 dark:text-neutral-100">{quote.companyName}</strong>
                    </div>
                  )}

                  {quote.projectName && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Project:</span>
                      <strong className="text-neutral-900 dark:text-neutral-100">{quote.projectName}</strong>
                    </div>
                  )}

                  {quote.quotationDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Quote Date:
                      </span>
                      <span className="text-neutral-900 dark:text-neutral-100 font-bold">
                        {new Date(quote.quotationDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> Uploaded:
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Uploaded By:</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{quote.uploadedBy}</span>
                  </div>
                </div>

                {quote.notes && (
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1 font-mono text-xs">
                    <span className="text-neutral-500 uppercase text-[10px] tracking-wider font-bold">Internal Notes:</span>
                    <p className="text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-950 p-3 rounded border border-neutral-200 dark:border-neutral-800 leading-relaxed whitespace-pre-wrap">
                      {quote.notes}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                    <span>Original Filename:</span>
                    <span className="truncate max-w-[140px]">{quote.file.originalName}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-500 text-[11px]">
                    <span>File Size:</span>
                    <span>{formatFileSize(quote.file.bytes)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded PDF Viewer Panel */}
            <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden flex flex-col min-h-[600px]">
              <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-500" /> Document Preview — {quote.file.originalName}
                </span>
                <a
                  href={`/api/admin/quotes/${quote.id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1"
                >
                  <span>Open in Full Tab</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex-1 bg-neutral-200 dark:bg-neutral-950 relative min-h-[550px]">
                <iframe
                  src={`/api/admin/quotes/${quote.id}/view`}
                  className="w-full h-full min-h-[550px] border-0"
                  title={quote.title}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Metadata Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg font-mono">
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-emerald-500" /> Edit Metadata
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update quotation archival parameters. The uploaded PDF will not be modified.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Quotation Title *</Label>
                <Input
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Client Name</Label>
                  <Input
                    value={editForm.clientName}
                    onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Company Name</Label>
                  <Input
                    value={editForm.companyName}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Quotation Number</Label>
                  <Input
                    value={editForm.quotationNumber}
                    onChange={(e) => setEditForm({ ...editForm, quotationNumber: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Quotation Date</Label>
                  <Input
                    type="date"
                    value={editForm.quotationDate}
                    onChange={(e) => setEditForm({ ...editForm, quotationDate: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Project Name</Label>
                <Input
                  value={editForm.projectName}
                  onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Internal Notes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="text-xs font-mono h-20"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isUpdating} className="text-xs bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
                {isUpdating ? "Saving..." : "Save Metadata"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeletingModalOpen} onOpenChange={setIsDeletingModalOpen}>
        <DialogContent className="sm:max-w-md font-mono">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Delete Quotation Archive?
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600 dark:text-neutral-400">
              Permanently remove quotation record "{quote?.title}" and delete its stored PDF asset from Cloudinary?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsDeletingModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteSubmit}
              className="text-xs bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
