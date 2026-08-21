"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight, Play, Pause, RefreshCw } from "lucide-react"
import { projectsData as defaultProjectsData } from "@/data/projects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectCMSItem, CmsStore } from "@/lib/cms"

const categories = ["All", "E-Commerce", "SaaS Dashboard", "Business Management", "Web Application", "Marketplace"]

export default function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = React.useState("All")
  const [cmsProjects, setCmsProjects] = React.useState<ProjectCMSItem[]>([])
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(true)
  const reducedMotion = React.useSyncExternalStore(
    (notify) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      mediaQuery.addEventListener("change", notify)
      return () => mediaQuery.removeEventListener("change", notify)
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

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

  const toggleVideo = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  const allProjects = cmsProjects.length > 0 ? cmsProjects : defaultProjectsData

  const filteredProjects = selectedCategory === "All"
    ? allProjects
    : allProjects.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" ref={sectionRef} className="border-b border-neutral-200 bg-white py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div
          className={`flex flex-col items-start justify-between gap-6 md:flex-row md:items-end transition-all duration-500 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              [ FEATURED CASE STUDIES ]
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
              Selected Software &amp; Web Work
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            A glimpse into how Olinethra designs, engineers, and delivers modern digital products with sub-second performance.
          </p>
        </div>

        {/* Selected Work Video Intro Feature Card */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-950 text-white dark:border-neutral-800 overflow-hidden relative group">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400 border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 rounded">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Engineering Intro (12s)
                </span>
                <span className="font-mono text-[10px] text-neutral-500 uppercase">Monochrome Studio</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Design &rarr; Architecture &rarr; Delivery
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl font-sans">
                Observe our full-stack engineering workflow in action — from high-fidelity Figma UI specs to Next.js App Router performance optimization and cloud deployments.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleVideo}
                  className="border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-mono"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 mr-1.5" /> Pause Video
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 mr-1.5" /> Play Video
                    </>
                  )}
                </Button>
                <span className="font-mono text-[11px] text-neutral-400 hidden sm:inline-block">
                  {reducedMotion ? "[Reduced Motion Enabled]" : "[Autoplay • Muted • Loop]"}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 aspect-video sm:aspect-16/10 relative overflow-hidden bg-neutral-900 border-t lg:border-t-0 lg:border-l border-neutral-800">
              {reducedMotion ? (
                /* Static fallback image when reduced motion is preferred */
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
                  alt="Olinethra Engineering Showcase"
                  className="w-full h-full object-cover grayscale opacity-90"
                />
              ) : (
                <video
                  ref={videoRef}
                  src="https://assets.mixkit.co/videos/preview/mixkit-code-animation-web-development-41656-large.mp4"
                  poster="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Olinethra software engineering showcase video"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800 overflow-x-auto">
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
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
              className={`group flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 ease-out hover:border-neutral-400 hover:shadow-lg hover:-translate-y-1.5 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {/* Card Media / Code Placeholder */}
              <div className="relative aspect-16/10 w-full overflow-hidden border-b border-neutral-200 bg-neutral-950 p-5 text-neutral-200 dark:border-neutral-800">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black transition-transform duration-500 ease-out group-hover:scale-105" />
                <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2">
                  <span>{(project as any).imagePlaceholder?.title || project.title}</span>
                  <span>{(project as any).year || "2026"}</span>
                </div>
                <div className="relative z-10 mt-4 space-y-2">
                  <p className="text-xs font-mono text-neutral-300 font-medium">
                    {(project as any).imagePlaceholder?.subtitle || project.client || "Web Platform"}
                  </p>
                  <div className="rounded border border-neutral-800 bg-neutral-900/90 p-2.5 font-mono text-[11px] text-neutral-400 overflow-x-auto transition-colors duration-300 group-hover:border-neutral-700">
                    <code>{(project as any).imagePlaceholder?.codeSnippet || `// Tech Stack: ${project.technologies?.slice(0, 3).join(", ")}`}</code>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 z-10 flex gap-1">
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
                  <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-2 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:text-neutral-900 dark:group-hover:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-2">
                    {(project as any).summary || project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 4).map((tech: any) => (
                      <span
                        key={tech}
                        className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-between border-neutral-300 font-medium dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Link href={`/projects/${(project as any).slug || project.id}`}>
                      <span>View Case Study</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <div className="mt-14 text-center">
          <Button asChild variant="outline" className="rounded-lg px-6 py-5 font-medium border-neutral-300 dark:border-neutral-700">
            <Link href="/projects" className="flex items-center gap-2 font-mono text-xs">
              Browse All Portfolio Projects &amp; Specifications
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
