import Link from "next/link"
import { ArrowLeft, Home, Code2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 border border-neutral-200 bg-neutral-50 px-3 py-1.5 rounded-full dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span>[ ERROR 404 — PAGE NOT FOUND ]</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            Resource Not Located
          </h1>

          <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            The page or route you are attempting to access does not exist, has been relocated, or is temporarily unavailable.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto font-medium">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                <span>Return to Homepage</span>
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-medium border-neutral-300 dark:border-neutral-700">
              <Link href="/projects" className="flex items-center justify-center gap-2">
                <span>View Selected Work</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Directory Quick Navigation */}
          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 text-left">
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-500 mb-3 text-center">
              Quick Directory Navigation
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-center">
              <Link href="/services" className="p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 transition-colors">
                Services
              </Link>
              <Link href="/insights" className="p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 transition-colors">
                Insights
              </Link>
              <Link href="/playground" className="p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 transition-colors">
                Playground
              </Link>
              <Link href="/contact" className="p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
