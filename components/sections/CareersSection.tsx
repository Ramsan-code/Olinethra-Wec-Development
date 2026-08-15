"use client"

import * as React from "react"
import { MapPin, Mail, Check } from "lucide-react"
import { careersData as defaultCareersData } from "@/data/careers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { InternshipItem, CmsStore } from "@/lib/cms"

export default function CareersSection() {
  const [selectedPosition, setSelectedPosition] = React.useState<any | null>(null)
  const [internships, setInternships] = React.useState<InternshipItem[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        if (data?.internships) {
          setInternships(data.internships)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const displayList = internships.length > 0 ? internships : defaultCareersData

  return (
    <section id="careers" className="border-b border-neutral-200 bg-neutral-50 py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-12 sm:mb-16">
          <div>
            <div className="inline-flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                [ JOIN OUR TEAM ]
              </span>
              <Badge variant="monochrome" className="text-[10px]">
                {displayList.filter((i: any) => i.status === "Open" || !i.status).length} ROLES OPEN
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
              Careers &amp; Internship Opportunities
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            We are actively looking for passionate developers and designers to build production software with our core team.
          </p>
        </div>

        {/* Positions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {displayList.map((job: any) => (
            <div
              key={job.id}
              className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 sm:p-7 transition-all duration-200 hover:border-neutral-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
            >
              <div>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 font-mono text-xs text-neutral-500">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                      {job.workType || job.type || "Remote"}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        job.status === "Open"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : "bg-red-500/10 text-red-600 border border-red-500/30"
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
                  {job.shortDesc}
                </p>

                {/* Requirements Snippet */}
                <div className="mb-6 space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">Core Requirements</h4>
                  <ul className="space-y-1.5">
                    {job.requirements?.slice(0, 3).map((req: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="flex-1 font-medium"
                >
                  <a href={`mailto:${job.applyEmail}?subject=Application for ${encodeURIComponent(job.title)}`}>
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
      </div>

      {/* Position Modal */}
      {selectedPosition && (
        <Dialog open={!!selectedPosition} onOpenChange={() => setSelectedPosition(null)}>
          <DialogContent className="max-w-2xl w-[92vw] sm:w-full p-5 sm:p-7 max-h-[88vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-neutral-500 uppercase">
                <span>{selectedPosition.type}</span>
                <span>•</span>
                <span>{selectedPosition.location}</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold mt-1">
                {selectedPosition.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Department: {selectedPosition.department} | Level: {selectedPosition.experienceLevel}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-2">
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {selectedPosition.description}
              </p>

              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-2">Key Responsibilities</h4>
                <ul className="space-y-1.5">
                  {selectedPosition.responsibilities?.map((res: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100 mt-0.5" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-2">Requirements</h4>
                <ul className="space-y-1.5">
                  {selectedPosition.requirements?.map((req: any, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <Button asChild className="w-full justify-center gap-2">
                  <a href={`mailto:${selectedPosition.applyEmail}?subject=Application for ${encodeURIComponent(selectedPosition.title)}`}>
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
