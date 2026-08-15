import Link from "next/link"
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-white py-16 sm:py-24 md:py-32 dark:border-neutral-800 dark:bg-neutral-950">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start max-w-4xl">
          {/* Status Badge */}
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] sm:text-xs font-mono text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-900 opacity-75 dark:bg-neutral-100"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-900 dark:bg-neutral-100"></span>
            </span>
            <span className="truncate">AVAILABLE FOR NEW PROJECTS & COLLABORATIONS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl dark:text-neutral-50 leading-[1.08]">
            Building Digital Experiences That Matter.
          </h1>

          {/* Supporting Copy */}
          <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-neutral-400 max-w-2.5xl font-normal">
            Olinethra is a professional web development studio. We design, architect, and engineer production-grade web applications, modern websites, and digital systems built for reliability and performance.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="rounded-lg px-6 py-6 text-base font-medium w-full sm:w-auto justify-center min-h-[48px]">
              <Link href="/contact" className="flex items-center gap-2">
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-lg border-neutral-300 px-6 py-6 text-base font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 w-full sm:w-auto justify-center min-h-[48px]">
              <Link href="/projects" className="flex items-center gap-2">
                Explore Our Work
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Technical Specs Indicator Bar */}
          <div className="mt-12 sm:mt-14 w-full border-t border-neutral-200 pt-6 sm:pt-8 dark:border-neutral-800">
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Core Technical Stack & Standards
            </p>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100" />
                <span>Next.js App Router</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100" />
                <span>TypeScript Strict</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100" />
                <span>Tailwind & shadcn/ui</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100" />
                <span>99+ Core Web Vitals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
