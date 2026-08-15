"use client"

import * as React from "react"
import { technologiesData } from "@/data/technologies"
import { Badge } from "@/components/ui/badge"
import { FigmaIcon } from "@/components/ui/icons"
import {
  Globe,
  Code,
  FileCode,
  Palette,
  Layers,
  Server,
  Cpu,
  Database,
  HardDrive,
  Terminal,
  Cloud,
  GitBranch,
  CheckCircle2,
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Code,
  FileCode,
  Palette,
  Layers,
  Server,
  Cpu,
  Database,
  HardDrive,
  Terminal,
  Cloud,
  GitBranch,
  Figma: FigmaIcon,
  CheckCircle2,
}

export default function TechnologiesSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)

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

  return (
    <section
      id="technologies"
      ref={sectionRef}
      className="border-b border-neutral-200 bg-neutral-50 py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-900/50 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Fade-Up */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 transition-all duration-500 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            [ TECHNICAL EXPERTISE &amp; INFRASTRUCTURE ]
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            Modern Stack &amp; Engineering Infrastructure
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            We leverage battle-tested open-source frameworks, type-safe programming languages, and cloud-native hosting environments.
          </p>
        </div>

        <div className="space-y-12">
          {technologiesData.map((techCat, catIdx) => (
            <div key={techCat.category} className="space-y-4">
              <div
                className={`flex items-center gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-800 transition-all duration-400 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: `${catIdx * 100}ms` }}
              >
                <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-900 font-bold dark:text-neutral-100">
                  {techCat.category}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">({techCat.items.length} Core Tools)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {techCat.items.map((item, itemIdx) => {
                  const Icon = iconMap[item.icon] || Code
                  const totalDelay = catIdx * 120 + itemIdx * 60

                  return (
                    <div
                      key={item.name}
                      style={{ transitionDelay: isVisible ? `${totalDelay}ms` : "0ms" }}
                      className={`group flex items-start gap-3.5 sm:gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-300 ease-out hover:border-neutral-400 hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 transition-transform duration-300 group-hover:scale-110 group-hover:bg-neutral-950 group-hover:text-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:group-hover:bg-neutral-100 dark:group-hover:text-neutral-950">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 truncate transition-colors duration-200 group-hover:text-neutral-900 dark:group-hover:text-white">
                            {item.name}
                          </h4>
                          <Badge variant="monochrome" className="text-[10px] shrink-0">
                            {item.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
