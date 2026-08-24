"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  Upload,
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  File,
  X,
  Building2,
  User,
  Hash,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function UploadQuotePage() {
  const router = useRouter()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [file, setFile] = React.useState<File | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  const [form, setForm] = React.useState({
    title: "",
    clientName: "",
    companyName: "",
    quotationNumber: "",
    quotationDate: "",
    projectName: "",
    notes: "",
  })

  const [isUploading, setIsUploading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState<string>("")

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Only PDF documents (.pdf) can be uploaded.")
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("PDF file size exceeds maximum limit of 10 MB.")
      return
    }

    setErrorMessage(null)
    setFile(selectedFile)

    // Auto-fill title if empty
    if (!form.title.trim()) {
      const titleWithoutExt = selectedFile.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ")
      setForm((prev) => ({ ...prev, title: titleWithoutExt }))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setErrorMessage("Please select or drop a PDF quotation file.")
      return
    }

    if (!form.title.trim()) {
      setErrorMessage("Quotation title is required.")
      return
    }

    setIsUploading(true)
    setErrorMessage(null)
    setUploadProgress("Uploading PDF to cloud storage...")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", form.title.trim())
      if (form.clientName.trim()) formData.append("clientName", form.clientName.trim())
      if (form.companyName.trim()) formData.append("companyName", form.companyName.trim())
      if (form.quotationNumber.trim()) formData.append("quotationNumber", form.quotationNumber.trim())
      if (form.quotationDate.trim()) formData.append("quotationDate", form.quotationDate.trim())
      if (form.projectName.trim()) formData.append("projectName", form.projectName.trim())
      if (form.notes.trim()) formData.append("notes", form.notes.trim())

      setUploadProgress("Saving quotation metadata...")
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data?.success) {
        setUploadProgress("Upload complete!")
        setTimeout(() => {
          router.push("/admin/quotes")
        }, 500)
      } else {
        setErrorMessage(data?.message || "Failed to upload quotation PDF.")
        setIsUploading(false)
      }
    } catch (err: any) {
      console.error("[UPLOAD QUOTE] Submission error:", err)
      setErrorMessage("An unexpected error occurred during file upload.")
      setIsUploading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="font-mono text-xs">
              <Link href="/admin/quotes" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Archives</span>
              </Link>
            </Button>
            <h1 className="font-mono text-base font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
              <Upload className="h-4 w-4 text-emerald-500" />
              Upload Existing Quotation PDF
            </h1>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-mono text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Zone */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" />
              1. Select PDF File *
            </h2>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragOver
                  ? "border-emerald-500 bg-emerald-500/5"
                  : file
                  ? "border-emerald-500/50 bg-neutral-50 dark:bg-neutral-950"
                  : "border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0])
                  }
                }}
              />

              {file ? (
                <div className="flex items-center justify-between max-w-md mx-auto p-3 rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 font-mono text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-emerald-500/10 text-emerald-600 shrink-0">
                      <File className="h-5 w-5" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-bold truncate text-neutral-950 dark:text-neutral-50">{file.name}</p>
                      <p className="text-[10px] text-neutral-500">{formatBytes(file.size)} • PDF Document</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-neutral-400" />
                  <p className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Drop your quotation PDF here, or <span className="text-emerald-600 dark:text-emerald-400 underline">browse files</span>
                  </p>
                  <p className="font-mono text-[11px] text-neutral-500">
                    PDF files only • Maximum size 10 MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Form Section */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Hash className="h-4 w-4 text-emerald-500" />
              2. Quotation Metadata
            </h2>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <Label className="text-xs font-mono">Quotation Title *</Label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Enterprise Web Portal — Acme Corp"
                  className="text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-neutral-400" /> Client Name
                  </Label>
                  <Input
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    placeholder="John Smith"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-mono flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-neutral-400" /> Company Name
                  </Label>
                  <Input
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Acme Technologies"
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-neutral-400" /> Quotation #
                  </Label>
                  <Input
                    value={form.quotationNumber}
                    onChange={(e) => setForm({ ...form, quotationNumber: e.target.value })}
                    placeholder="QT-2026-081"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-mono flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" /> Quotation Date
                  </Label>
                  <Input
                    type="date"
                    value={form.quotationDate}
                    onChange={(e) => setForm({ ...form, quotationDate: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono">Project Name</Label>
                <Input
                  value={form.projectName}
                  onChange={(e) => setForm({ ...form, projectName: e.target.value })}
                  placeholder="E-Commerce Platform & Mobile API"
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-mono">Internal Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional internal remarks regarding scope, special rates, or payment milestones..."
                  className="text-xs font-mono h-24"
                />
              </div>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="flex items-center justify-between pt-2">
            <Button asChild variant="outline" type="button" className="font-mono text-xs">
              <Link href="/admin/quotes">Cancel</Link>
            </Button>

            <Button
              type="submit"
              disabled={isUploading || !file}
              className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 font-mono text-xs px-6"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-black"></span>
                  <span>{uploadProgress || "Uploading..."}</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Archive Quotation PDF</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
