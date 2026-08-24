import Link from "next/link"
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FinalCtaSection() {
  return (
    <section className="border-b border-neutral-200 bg-neutral-950 text-white py-20 sm:py-28 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400 uppercase tracking-widest border border-neutral-800 bg-neutral-900/80 px-3 py-1 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>[ START A PROJECT ]</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Have a Project in Mind? Let&apos;s Build Something Useful.
        </h2>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed font-sans">
          Whether you need a high-performance Next.js application, an enterprise dashboard, or custom AI integrations, our engineering team is ready to collaborate.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-xl px-8 py-6 text-base font-bold bg-white text-neutral-950 hover:bg-neutral-200 w-full sm:w-auto">
            <Link href="/contact" className="flex items-center justify-center gap-2">
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-xl border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 text-base font-medium w-full sm:w-auto">
            <Link href="/services">
              Explore Capabilities
            </Link>
          </Button>
        </div>

        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-400 border-t border-neutral-800/80 max-w-2xl mx-auto">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-neutral-400" />
            hello@olinethra.com
          </span>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-neutral-400" />
            +1 (555) 019-2834
          </span>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
            Vavuniya, Sri Lanka
          </span>
        </div>
      </div>
    </section>
  )
}
