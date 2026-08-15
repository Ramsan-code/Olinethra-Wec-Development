"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { projectsData as defaultProjectsData } from "@/data/projects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ProjectCMSItem, CmsStore } from "@/lib/cms"

const categories = ["All", "E-Commerce", "SaaS Dashboard", "Business Management", "Web Application", "Marketplace"]

export default function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [activeProject, setActiveProject] = React.useState<any | null>(null)
  const [cmsProjects, setCmsProjects] = React.useState<ProjectCMSItem[]>([])

  React.useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        if (data?.projects) {
          const published = data.projects.filter((p) => p.status === "Published")
          setCmsProjects(published)
        }
      })
      .catch(() => {})
  }, [])

  const allProjects = cmsProjects.length > 0 ? cmsProjects : defaultProjectsData

  const filteredProjects = selectedCategory === "All"
    ? allProjects
    : allProjects.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" className="border-b border-neutral-200 bg-white py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end mb-10 sm:mb-12">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              [ FEATURED CASE STUDIES ]
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
              Selected Software & Web Work
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            A portfolio of web platforms, enterprise dashboards, and e-commerce storefronts engineered for client impact.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10 pb-4 border-b border-neutral-100 dark:border-neutral-800 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 sm:px-4 py-1.5 text-xs font-mono transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-200 hover:border-neutral-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
            >
              {/* Black & White Visual Code Placeholder Card */}
              <div className="relative aspect-16/10 w-full overflow-hidden border-b border-neutral-200 bg-neutral-950 p-5 text-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2">
                  <span>{(project as any).imagePlaceholder?.title || project.title}</span>
                  <span>{(project as any).year || "2026"}</span>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-mono text-neutral-300 font-medium">
                    {(project as any).imagePlaceholder?.subtitle || project.client || "Web Platform"}
                  </p>
                  <div className="rounded border border-neutral-800 bg-neutral-900/90 p-2.5 font-mono text-[11px] text-neutral-400 overflow-x-auto">
                    <code>{(project as any).imagePlaceholder?.codeSnippet || `// Tech Stack: ${project.technologies?.slice(0, 3).join(", ")}`}</code>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 flex gap-1">
                  <Badge variant="monochrome" className="text-[9px] bg-neutral-900 text-neutral-300">
                    {project.category}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-neutral-500">{project.client}</span>
                    <span className="font-mono text-xs text-neutral-400">{(project as any).year || "2026"}</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-2 group-hover:text-neutral-900">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-2">
                    {(project as any).summary || project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveProject(project)}
                  className="w-full justify-between border-neutral-300 font-medium dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>View Case Details</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <div className="mt-14 text-center">
          <Button asChild variant="outline" className="rounded-lg px-6 py-5 font-medium border-neutral-300 dark:border-neutral-700">
            <Link href="/projects" className="flex items-center gap-2">
              Browse All Projects & Architecture Specifications
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <Dialog open={!!activeProject} onOpenChange={() => setActiveProject(null)}>
          <DialogContent className="max-w-2xl w-[92vw] sm:w-full p-5 sm:p-7 max-h-[88vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase">
                <span>{activeProject.category}</span>
                <span>•</span>
                <span>{activeProject.year}</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold mt-1">
                {activeProject.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Client: {activeProject.client}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 my-2">
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {activeProject.description}
              </p>

              {/* Metrics Grid */}
              {activeProject.metrics && activeProject.metrics.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-neutral-200 py-4 dark:border-neutral-800">
                  {activeProject.metrics.map((m: any) => (
                    <div key={m.label} className="text-center bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-lg sm:bg-transparent dark:sm:bg-transparent">
                      <div className="font-mono text-lg sm:text-xl font-bold text-neutral-950 dark:text-neutral-50">
                        {m.value}
                      </div>
                      <div className="text-xs text-neutral-500 font-mono mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech Stack */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {activeProject.technologies?.map((tech: any) => (
                    <Badge key={tech} variant="monochrome">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
