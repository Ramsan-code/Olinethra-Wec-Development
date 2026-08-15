"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { MessageSquare, Search, Mail, Building, Trash2, Flame } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProjectInquiryItem, CmsStore } from "@/lib/cms"

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = React.useState<ProjectInquiryItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState("All")

  const fetchInquiries = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setInquiries(data.inquiries || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  const handleUpdateStatus = async (item: ProjectInquiryItem, newStatus: ProjectInquiryItem["status"]) => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          entity: "inquiries",
          data: { ...item, status: newStatus },
        }),
      })
      if (res.ok) fetchInquiries()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry record?")) return
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          entity: "inquiries",
          data: { id },
        }),
      })
      if (res.ok) fetchInquiries()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "All" || inq.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ CLIENT LEAD MANAGEMENT &amp; CRM ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Contact &amp; Project Inquiries
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Project requests submitted from the public contact page and AI Chatbot.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search inquiry name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {["All", "New", "Contacted", "Discussion", "Proposal", "Won", "Lost"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition-colors ${
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

        {/* Inquiries List */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No project inquiries found.</div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className="flex flex-col md:flex-row md:items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-950 dark:text-neutral-50">{inq.name}</h3>
                    {inq.company && (
                      <span className="flex items-center gap-1 font-mono text-xs text-neutral-500">
                        <Building className="h-3 w-3" /> {inq.company}
                      </span>
                    )}
                    {inq.priority === "HIGH" && (
                      <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 border border-emerald-500/30">
                        <Flame className="h-3 w-3" /> HIGH PRIORITY
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-100 dark:border-neutral-850">
                    {inq.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {inq.email}
                    </span>
                    <span>•</span>
                    <span>Type: {inq.projectType}</span>
                    {inq.budget && (
                      <>
                        <span>•</span>
                        <span>Budget: {inq.budget}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Date: {inq.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-t border-neutral-100 md:border-0 pt-3 md:pt-0 dark:border-neutral-800">
                  <select
                    value={inq.status}
                    onChange={(e) => handleUpdateStatus(inq, e.target.value as any)}
                    className="h-8 rounded-lg border border-neutral-300 bg-white px-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="New">Status: New</option>
                    <option value="Contacted">Status: Contacted</option>
                    <option value="Discussion">Status: Discussion</option>
                    <option value="Proposal">Status: Proposal</option>
                    <option value="Won">Status: Won</option>
                    <option value="Lost">Status: Lost</option>
                  </select>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(inq.id)}
                    className="h-8 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
