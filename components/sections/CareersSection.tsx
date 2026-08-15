"use client"

import * as React from "react"
import { MapPin, Mail, Check, ArrowRight, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { InternshipItem, JobItem, CmsStore } from "@/lib/cms"

export default function CareersSection() {
  const [selectedPosition, setSelectedPosition] = React.useState<any | null>(null)
  const [activeTab, setActiveTab] = React.useState<"internships" | "jobs">("internships")
  const [internships, setInternships] = React.useState<InternshipItem[]>([])
  const [jobs, setJobs] = React.useState<JobItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        if (data?.internships) setInternships(data.internships)
        if (data?.jobs) setJobs(data.jobs)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const currentList = activeTab === "internships" ? internships : jobs
  const openCount = currentList.filter((i) => i.status === "Open").length

  return (
    <section id="careers" className="border-b border-neutral-200 bg-neutral-50 py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-10 sm:mb-12">
          <div>
            <div className="inline-flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                [ JOIN OUR TEAM ]
              </span>
              <Badge variant="monochrome" className="text-[10px]">
                {openCount} {openCount === 1 ? "ROLE OPEN" : "ROLES OPEN"}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
              Careers &amp; Developer Opportunities
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            Build production web applications alongside core engineering leads. Select a category below to explore active listings.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 mb-8 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab("internships")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono transition-all ${
              activeTab === "internships"
                ? "bg-neutral-950 text-white font-semibold dark:bg-neutral-100 dark:text-neutral-950"
                : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            <span>Internship Opportunities</span>
            <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-white dark:bg-neutral-200 dark:text-neutral-950">
              {internships.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono transition-all ${
              activeTab === "jobs"
                ? "bg-neutral-950 text-white font-semibold dark:bg-neutral-100 dark:text-neutral-950"
                : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            <span>Full-Time Roles</span>
            <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-white dark:bg-neutral-200 dark:text-neutral-950">
              {jobs.length}
            </span>
          </button>
        </div>

        {/* Positions Grid or Empty State */}
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 mb-4">
              <Briefcase className="h-6 w-6 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              No open positions right now.
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
              We are always on the lookout for exceptional engineering talent. Send us your CV for future openings.
            </p>
            <Button asChild className="mt-6 gap-2 bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
              <a href="mailto:careers@olinethra.com?subject=Spontaneous%20Application">
                Send Your CV
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {currentList.map((job: any) => (
              <div
                key={job.id}
                className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 sm:p-7 transition-all duration-200 hover:border-neutral-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
              >
                <div>
                  {/* Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-xs text-neutral-500">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                        {job.workType || job.employmentType || "Remote"}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          job.status === "Open"
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                        }`}
                      >
                        {job.status || "Open"}
                      </span>
                    </div>
                    <span className="text-neutral-400">{job.department}</span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-2">
                    {job.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6">
                    {job.description || job.shortDesc}
                  </p>

                  {/* Requirements Snippet */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-6 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                      <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">Core Requirements</h4>
                      <ul className="space-y-1.5">
                        {job.requirements.slice(0, 3).map((req: any, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                            <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="flex-1 font-medium"
                  >
                    <a href={`mailto:careers@olinethra.com?subject=Application for ${encodeURIComponent(job.title)}`}>
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      Apply via Email
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPosition(job)}
                    className="border-neutral-300 dark:border-neutral-700"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Position Modal */}
      {selectedPosition && (
        <Dialog open={!!selectedPosition} onOpenChange={() => setSelectedPosition(null)}>
          <DialogContent className="max-w-2xl w-[92vw] sm:w-full p-5 sm:p-7 max-h-[88vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-neutral-500 uppercase">
                <span>{selectedPosition.workType || selectedPosition.employmentType || "Remote"}</span>
                <span>•</span>
                <span>{selectedPosition.location}</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold mt-1">
                {selectedPosition.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Department: {selectedPosition.department} {selectedPosition.salary ? `| Salary: ${selectedPosition.salary}` : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-2">
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {selectedPosition.description}
              </p>

              {selectedPosition.responsibilities && selectedPosition.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-2">Key Responsibilities</h4>
                  <ul className="space-y-1.5">
                    {selectedPosition.responsibilities.map((res: any, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100 mt-0.5" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPosition.requirements && selectedPosition.requirements.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-2">Requirements</h4>
                  <ul className="space-y-1.5">
                    {selectedPosition.requirements.map((req: any, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <Button asChild className="w-full justify-center gap-2">
                  <a href={`mailto:careers@olinethra.com?subject=Application for ${encodeURIComponent(selectedPosition.title)}`}>
                    <Mail className="h-4 w-4" />
                    Send Application to careers@olinethra.com
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
