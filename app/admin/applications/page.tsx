"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { FileText, Search, Mail, Phone, ExternalLink, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ApplicationItem, CmsStore } from "@/lib/cms"

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = React.useState<ApplicationItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState("All")

  const fetchApplications = React.useCallback(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        setApplications(data.applications || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  React.useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleUpdateStatus = async (item: ApplicationItem, newStatus: ApplicationItem["status"]) => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          entity: "applications",
          data: { ...item, status: newStatus },
        }),
      })
      if (res.ok) fetchApplications()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.opportunityTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "All" || app.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ RECRUITMENT INBOX ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Internship &amp; Job Applications
            </h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Review received applicant CVs, cover notes, and manage candidate hiring stages.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search applicant name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-9 bg-neutral-50 dark:bg-neutral-950"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {["All", "New", "Reviewing", "Shortlisted", "Rejected", "Accepted"].map((st) => (
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

        {/* Applications Cards / Responsive List */}
        {loading ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">Loading applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">No applications found.</div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base text-neutral-950 dark:text-neutral-50">{app.applicantName}</h3>
                    <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                      {app.opportunityType}
                    </span>
                    <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      Role: {app.opportunityTitle}
                    </span>
                  </div>

                  {app.coverNote && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 italic">&ldquo;{app.coverNote}&rdquo;</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {app.email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {app.phone}
                    </span>
                    <span>•</span>
                    <span>Applied: {app.appliedDate}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 border-t border-neutral-100 md:border-0 pt-3 md:pt-0 dark:border-neutral-800">
                  {app.resumeUrl && (
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs font-mono">
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1">
                        <span>CV / Resume</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}

                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app, e.target.value as any)}
                    className="h-8 rounded-lg border border-neutral-300 bg-white px-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="New">Status: New</option>
                    <option value="Reviewing">Status: Reviewing</option>
                    <option value="Shortlisted">Status: Shortlisted</option>
                    <option value="Rejected">Status: Rejected</option>
                    <option value="Accepted">Status: Accepted</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
