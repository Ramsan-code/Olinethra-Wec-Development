import Link from "next/link"
import { ArrowUpRight, ShieldCheck, Code, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

const coreValues = [
  {
    icon: Code,
    number: "01",
    title: "Engineering Discipline",
    description: "We write clean, strictly-typed TypeScript code structured for long-term maintainability, continuous testing, and zero debt."
  },
  {
    icon: Layers,
    number: "02",
    title: "UI/UX Precision",
    description: "Every layout, font size, and micro-interaction is designed purposefully to deliver intuitive user navigation and high conversion."
  },
  {
    icon: Zap,
    number: "03",
    title: "Performance First",
    description: "We build for speed. Optimizing bundle sizes, server rendering, and Core Web Vitals guarantees rapid page load times across all devices."
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Trust & Transparency",
    description: "Clear communication, predictable sprint milestones, complete IP ownership handoff, and ongoing support for your peace of mind."
  }
]

export default function AboutSection() {
  return (
    <section id="about" className="border-b border-neutral-200 bg-neutral-50 py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Section Header & Main Text (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-block font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              [ ABOUT OLINETHRA ]
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50 leading-tight">
              An engineering-first software studio focused on craft & performance.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              Olinethra was founded to bridge the gap between technical complexity and refined product design. We don&apos;t build generic templates—we architect bespoke digital products, web applications, and marketing platforms designed for growth.
            </p>
            <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              Our multidisciplinary team of full-stack engineers and UI designers collaborates closely with startups, growth-stage companies, and enterprises to deliver software that scales effortlessly.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button asChild variant="outline" className="border-neutral-300 dark:border-neutral-700 text-xs">
                <Link href="/about" className="flex items-center gap-1.5 font-medium">
                  Read Our Full Story
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Compact Founder's Notes Medium Callout */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold">
                [ FOUNDER&apos;S NOTES ]
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Engineering ideas, lessons, and observations from building Olinethra.
              </p>
              <a
                href="https://medium.com/@thavamramsan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-neutral-950 dark:text-neutral-50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <span>Read on Medium</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Core Principles Grid (7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {coreValues.map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-neutral-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-neutral-400">{value.number}</span>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-950 dark:text-neutral-50 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {value.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
