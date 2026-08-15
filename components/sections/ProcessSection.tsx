import { processData } from "@/data/process"
import { Check } from "lucide-react"

export default function ProcessSection() {
  return (
    <section id="process" className="border-b border-neutral-200 bg-neutral-50 py-24 dark:border-neutral-800 dark:bg-neutral-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            [ DEVELOPMENT WORKFLOW ]
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-50">
            Our 6-Phase Engineering Process
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            A systematic, predictable software development workflow designed to deliver projects on time, within scope, and bug-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processData.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-7 transition-all duration-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
            >
              <div>
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                  <span className="font-mono text-2xl font-black text-neutral-950 dark:text-neutral-50">
                    {step.number}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                    PHASE {step.number}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-1">
                  {step.title}
                </h3>
                <p className="font-mono text-xs text-neutral-500 mb-4 dark:text-neutral-400">
                  {step.tagline}
                </p>

                {/* Description */}
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6">
                  {step.description}
                </p>
              </div>

              {/* Key Activities */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-3">Key Deliverables</h4>
                <ul className="space-y-1.5">
                  {step.keyActivities.map((activity, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <Check className="h-3 w-3 shrink-0 text-neutral-900 dark:text-neutral-100" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
