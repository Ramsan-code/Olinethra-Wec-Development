import { technologiesData } from "@/data/technologies"
import { Badge } from "@/components/ui/badge"
import { FigmaIcon } from "@/components/ui/icons"
import { Globe, Code, FileCode, Palette, Layers, Server, Cpu, Database, HardDrive, Terminal, Cloud, GitBranch, CheckCircle2 } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Code, FileCode, Palette, Layers, Server, Cpu, Database, HardDrive, Terminal, Cloud, GitBranch, Figma: FigmaIcon, CheckCircle2
}

export default function TechnologiesSection() {
  return (
    <section id="technologies" className="border-b border-neutral-200 bg-neutral-50 py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            [ TECHNICAL EXPERTISE ]
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            Modern Stack & Engineering Infrastructure
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            We leverage battle-tested open-source frameworks, type-safe programming languages, and cloud-native hosting environments.
          </p>
        </div>

        <div className="space-y-12">
          {technologiesData.map((techCat) => (
            <div key={techCat.category} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-3 dark:border-neutral-800">
                <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-900 font-bold dark:text-neutral-100">
                  {techCat.category}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">({techCat.items.length} Core Tools)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {techCat.items.map((item) => {
                  const Icon = iconMap[item.icon] || Code
                  return (
                    <div
                      key={item.name}
                      className="group flex items-start gap-3.5 sm:gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:border-neutral-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4 className="text-sm font-bold text-neutral-950 dark:text-neutral-50 truncate">
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
