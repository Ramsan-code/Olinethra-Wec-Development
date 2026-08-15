import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { getCmsData } from "@/lib/cms"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Code2, CheckCircle2, Sparkles, Layers, ShieldCheck } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cms = getCmsData()
  const project = cms.projects.find((p) => p.slug === slug || p.id === slug)
  if (!project) return { title: "Project Not Found — Olinethra" }

  return {
    title: `${project.title} — Case Study | Olinethra`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const cms = getCmsData()
  const project = cms.projects.find((p) => (p.slug === slug || p.id === slug) && p.status === "Published")

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Back Navigation */}
          <div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Selected Work</span>
            </Link>
          </div>

          {/* Project Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-neutral-100 px-3 py-1 font-mono text-xs font-semibold text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                {project.category}
              </span>
              <span className="font-mono text-xs text-neutral-400">Client: {project.client}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.projectUrl && project.projectUrl !== "#" && (
                <Button asChild className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200">
                  <a href={project.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs">
                    <span>Visit Live Application</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button asChild variant="outline" className="border-neutral-300 dark:border-neutral-700">
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs">
                    <Code2 className="h-4 w-4" />
                    <span>View Repository</span>
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Hero Media (Image or Showcase Video) */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden aspect-video relative">
            {project.videoUrl ? (
              <video
                src={project.videoUrl}
                poster={project.videoPoster || project.thumbnail}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={project.heroImage || project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Core Technical Highlights & Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            {/* Main Content Body */}
            <div className="lg:col-span-8 space-y-12">
              {/* Challenge / Context */}
              <div className="space-y-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  [ 01 / THE CHALLENGE ]
                </span>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-neutral-50">Problem &amp; Objectives</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans text-base">
                  {project.challenges || project.caseStudy || "The client required a modern, highly responsive software platform capable of rendering real-time data, maintaining sub-second API latency, and delivering a clean user interface."}
                </p>
              </div>

              {/* Solution / Engineering */}
              <div className="space-y-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  [ 02 / ENGINEERING SOLUTION ]
                </span>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-neutral-50">Architecture &amp; Implementation</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans text-base">
                  {project.solution || "Olinethra architected a full-stack Next.js application integrated with scalable backend endpoints, responsive UI components, and automated deployment pipelines."}
                </p>
              </div>

              {/* Gallery Grid */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-4 pt-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    [ 03 / INTERFACE GALLERY ]
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery.map((img, idx) => (
                      <div key={idx} className="rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden dark:border-neutral-800 dark:bg-neutral-900 aspect-video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-8">
              {/* Technologies */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
                <h3 className="font-mono text-xs uppercase font-bold text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>Technologies Used</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 font-mono text-xs text-neutral-800 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Impact & Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
                  <h3 className="font-mono text-xs uppercase font-bold text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Project Metrics</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="font-mono text-xl font-extrabold text-neutral-950 dark:text-neutral-50">{m.value}</div>
                        <div className="text-[11px] font-mono text-neutral-500">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="rounded-2xl border border-neutral-950 bg-neutral-950 p-8 sm:p-12 text-white dark:border-neutral-800 dark:bg-neutral-900 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                [ READY TO BUILD? ]
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Have a similar project in mind?</h3>
              <p className="text-sm text-neutral-300 max-w-xl">
                Let&apos;s engineer a high-performance web application tailored to your business goals.
              </p>
            </div>
            <Button asChild size="lg" className="bg-white text-neutral-950 hover:bg-neutral-200 font-mono text-xs uppercase tracking-wider shrink-0">
              <Link href="/contact">Start a Project →</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
