"use client"

import * as React from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  FileText,
  Upload,
  Search,
  Eye,
  Download,
  Edit2,
  Trash2,
  Calendar,
  Building2,
  User,
  Hash,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
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
}

export default function QuotesArchivePage() {
  const [quotes, setQuotes] = React.useState<Quote[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)

  // Edit Modal State
  const [editingQuote, setEditingQuote] = React.useState<Quote | null>(null)
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
  const [deletingQuote, setDeletingQuote] = React.useState<Quote | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Notification Banner
  const [toastMessage, setToastMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchQuotes = React.useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: "15",
        ...(search.trim() ? { search: search.trim() } : {}),
      })
      const res = await fetch(`/api/admin/quotes?${query.toString()}`)
      const data = await res.json()
      if (res.ok && data?.data) {
        setQuotes(data.data.quotes || [])
        setTotalPages(data.data.totalPages || 1)
        setTotal(data.data.total || 0)
      } else {
        setQuotes([])
      }
    } catch (err) {
      console.error("Failed to load quotation archive:", err)
      setQuotes([])
    } finally {
      setLoading(false)
    }
  }, [page, search])

  React.useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchQuotes()
  }

  const openEditModal = (quote: Quote) => {
    setEditingQuote(quote)
    setEditForm({
      title: quote.title || "",
      clientName: quote.clientName || "",
      companyName: quote.companyName || "",
      quotationNumber: quote.quotationNumber || "",
      quotationDate: quote.quotationDate ? quote.quotationDate.split("T")[0] : "",
      projectName: quote.projectName || "",
      notes: quote.notes || "",
    })
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQuote) return

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/quotes/${editingQuote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      const data = await res.json()
      if (res.ok) {
        setToastMessage({ type: "success", text: "Quotation metadata updated successfully!" })
        setEditingQuote(null)
        fetchQuotes()
      } else {
        setToastMessage({ type: "error", text: data?.message || "Failed to update quotation." })
      }
    } catch (err) {
      setToastMessage({ type: "error", text: "An error occurred while updating." })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!deletingQuote) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/quotes/${deletingQuote.id}`, {
        method: "DELETE",
      })

      const data = await res.json()
      if (res.ok) {
        setToastMessage({ type: "success", text: "Quotation record deleted successfully!" })
        setDeletingQuote(null)
        fetchQuotes()
      } else {
        setToastMessage({ type: "error", text: data?.message || "Failed to delete quotation." })
      }
    } catch (err) {
      setToastMessage({ type: "error", text: "An error occurred during deletion." })
    } finally {
      setIsDeleting(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "PDF"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800">
          <div>
            <h1 className="font-mono text-xl font-bold uppercase tracking-wide text-neutral-950 dark:text-neutral-50 flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-emerald-500" />
              Existing Quotation Archive
            </h1>
            <p className="mt-1 text-xs text-neutral-500 font-mono">
              Secure internal repository for storing, organizing, and retrieving existing client quotation PDFs.
            </p>
          </div>

          <Button asChild className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 font-mono text-xs">
            <Link href="/admin/quotes/upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Quotation PDF</span>
            </Link>
          </Button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`flex items-center justify-between rounded-lg p-3 text-xs font-mono border ${
              toastMessage.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
              <span>{toastMessage.text}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="font-bold underline hover:opacity-75">
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search title, client, company, quote #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs font-mono bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm" className="font-mono text-xs">
              Search
            </Button>
          </form>

          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
            <span>
              Total Archives: <strong className="text-neutral-900 dark:text-neutral-100">{total}</strong>
            </span>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
          {loading ? (
            <div className="p-12 text-center text-xs font-mono text-neutral-500 flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent"></span>
              <span>Loading quotation archives...</span>
            </div>
          ) : quotes.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FileText className="mx-auto h-10 w-10 text-neutral-400 opacity-60" />
              <div className="space-y-1">
                <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {search ? "No matching quotation records found" : "No quotations uploaded yet"}
                </p>
                <p className="max-w-md mx-auto text-xs text-neutral-500 font-mono">
                  {search
                    ? `Try adjusting your search query "${search}" to find historical documents.`
                    : "Upload existing quotation PDFs to keep them securely organized in Olinethra."}
                </p>
              </div>
              {!search && (
                <Button asChild variant="outline" size="sm" className="font-mono text-xs mt-2">
                  <Link href="/admin/quotes/upload">
                    <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload First Quote
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-neutral-200 bg-neutral-50 uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950">
                  <tr>
                    <th className="px-4 py-3">Quotation Title</th>
                    <th className="px-4 py-3">Client / Company</th>
                    <th className="px-4 py-3">Quote #</th>
                    <th className="px-4 py-3">Quote Date</th>
                    <th className="px-4 py-3">File Info</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
                      {/* Title & Project */}
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <Link href={`/admin/quotes/${quote.id}`} className="font-bold text-neutral-950 hover:text-emerald-600 dark:text-neutral-50 dark:hover:text-emerald-400 block truncate">
                          {quote.title}
                        </Link>
                        {quote.projectName && (
                          <span className="text-[11px] text-neutral-500 block truncate">
                            Project: {quote.projectName}
                          </span>
                        )}
                      </td>

                      {/* Client / Company */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-medium text-neutral-900 dark:text-neutral-200">
                          <User className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                          <span>{quote.clientName || "—"}</span>
                        </div>
                        {quote.companyName && (
                          <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                            <Building2 className="h-3 w-3 shrink-0" />
                            <span>{quote.companyName}</span>
                          </div>
                        )}
                      </td>

                      {/* Quote Number */}
                      <td className="px-4 py-3.5">
                        {quote.quotationNumber ? (
                          <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-bold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                            <Hash className="h-3 w-3 text-neutral-400" />
                            {quote.quotationNumber}
                          </span>
                        ) : (
                          <span className="text-neutral-400">—</span>
                        )}
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-3.5 text-neutral-600 dark:text-neutral-400">
                        {quote.quotationDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                            <span>{new Date(quote.quotationDate).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400">{new Date(quote.createdAt).toLocaleDateString()}</span>
                        )}
                      </td>

                      {/* File */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
                          PDF • {formatFileSize(quote.file?.bytes)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-1">
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400" title="View PDF">
                          <a href={`/api/admin/quotes/${quote.id}/view`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3.5 w-3.5" />
                          </a>
                        </Button>

                        <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400" title="Download PDF">
                          <a href={`/api/admin/quotes/${quote.id}/download`} download>
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(quote)}
                          className="h-7 w-7 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400"
                          title="Edit Metadata"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingQuote(quote)}
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Quote Archive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <span className="font-mono text-xs text-neutral-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 text-xs font-mono"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="h-8 text-xs font-mono"
                >
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Metadata Modal */}
      <Dialog open={Boolean(editingQuote)} onOpenChange={(open) => !open && setEditingQuote(null)}>
        <DialogContent className="sm:max-w-lg font-mono">
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-emerald-500" />
                Edit Quotation Metadata
              </DialogTitle>
              <DialogDescription className="text-xs">
                Update historical details for "{editingQuote?.title}". The stored PDF document will remain untouched.
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
                  placeholder="e.g. Website Redesign Quote — Acme Corp"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Client Name</Label>
                  <Input
                    value={editForm.clientName}
                    onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                    className="text-xs font-mono"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Company Name</Label>
                  <Input
                    value={editForm.companyName}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    className="text-xs font-mono"
                    placeholder="Acme Inc."
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
                    placeholder="QT-2026-081"
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
                  placeholder="Full-Stack Web Portal"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Internal Notes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="text-xs font-mono h-20"
                  placeholder="Optional internal comments regarding discount, scope, or revisions..."
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingQuote(null)} className="text-xs">
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
      <Dialog open={Boolean(deletingQuote)} onOpenChange={(open) => !open && setDeletingQuote(null)}>
        <DialogContent className="sm:max-w-md font-mono">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Delete Quotation Archive?
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-600 dark:text-neutral-400">
              This action cannot be undone. This will permanently remove the quotation record "
              <strong className="text-neutral-950 dark:text-neutral-50">{deletingQuote?.title}</strong>" and purge its PDF file from Cloudinary storage.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setDeletingQuote(null)} className="text-xs">
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
