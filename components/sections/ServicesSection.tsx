import Link from "next/link"
import { Code2, Layout, Server, ShoppingBag, Cpu, Zap, ArrowRight, Check } from "lucide-react"
import { servicesData, ServiceItem } from "@/data/services"
import { Button } from "@/components/ui/button"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Layout,
  Server,
  ShoppingBag,
  Cpu,
  Zap,
}

interface ServicesSectionProps {
  isHomepage?: boolean
}

export default function ServicesSection({ isHomepage = false }: ServicesSectionProps) {
  const displayServices = isHomepage ? servicesData.slice(0, 4) : servicesData

  return (
    <section id="services" className="border-b border-neutral-200 bg-white py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              [ OUR CAPABILITIES ]
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
              {isHomepage ? "What We Build & Engineer" : "Services & Technical Solutions"}
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            {isHomepage
              ? "A high-level overview of our core development capabilities and digital software solutions."
              : "End-to-end engineering and design capabilities tailored to deliver measurable business outcomes and long-term scalability."}
          </p>
        </div>

        {/* Services Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isHomepage ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6 sm:gap-8`}>
          {displayServices.map((service: ServiceItem) => {
            const Icon = iconMap[service.iconName] || Code2
            return (
              <div
                key={service.id}
                id={service.id}
                className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 sm:p-7 transition-all duration-200 hover:border-neutral-400 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-600"
              >
                <div>
                  {/* Icon & ID */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 transition-colors group-hover:bg-neutral-900 group-hover:text-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:group-hover:bg-white dark:group-hover:text-neutral-950">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs text-neutral-400 uppercase">
                      /{service.id.slice(0, 10)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50 mb-3 group-hover:text-neutral-900 dark:group-hover:text-white">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-4">
                    {service.shortDesc}
                  </p>

                  {/* Features List (Only on full page) */}
                  {!isHomepage && (
                    <ul className="space-y-2 border-t border-neutral-100 pt-4 dark:border-neutral-800/80">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                          <Check className="h-3.5 w-3.5 shrink-0 text-neutral-900 dark:text-neutral-100" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <Button asChild variant="ghost" size="sm" className="w-full justify-between px-0 font-medium text-neutral-900 hover:bg-transparent dark:text-neutral-100">
                    <Link href={`/services#${service.id}`}>
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {isHomepage && (
          <div className="text-center pt-4">
            <Button asChild variant="outline" className="rounded-lg px-6 py-5 font-mono text-xs font-bold border-neutral-300 dark:border-neutral-700">
              <Link href="/services" className="flex items-center gap-2">
                <span>Explore All Technical Capabilities &amp; Services</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
