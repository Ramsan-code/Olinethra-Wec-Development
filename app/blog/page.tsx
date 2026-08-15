import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"
import { ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Engineering Articles & Insights | Olinethra",
  description: "Technical articles on Next.js, React performance, UI design systems, and web architecture by Olinethra.",
}

const articles = [
  {
    title: "Optimizing Next.js 15+ Core Web Vitals for Production Platforms",
    date: "August 2026",
    readTime: "6 min read",
    summary: "How we achieve sub-400ms initial paint times using Server Components, font optimization, and minimal client-side hydration bundles.",
    tag: "Performance",
  },
  {
    title: "Monochrome Design Systems: Achieving Visual Depth Without Color Clutter",
    date: "July 2026",
    readTime: "8 min read",
    summary: "A deep dive into typography hierarchy, grid borders, and subtle opacity micro-interactions in modern technical software interfaces.",
    tag: "UI/UX Design",
  },
  {
    title: "Building Resilient PostgreSQL & Prisma Schemas for Scalable Web Apps",
    date: "June 2026",
    readTime: "10 min read",
    summary: "Best practices for relational data modeling, index optimization, and connection pooling in serverless edge environments.",
    tag: "Backend",
  },
]

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-neutral-200 bg-neutral-950 py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              [ ENGINEERING INSIGHTS ]
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Articles & Technical Writings
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-neutral-300">
              In-depth articles covering web performance, Next.js architecture, UI design systems, and full-stack engineering.
            </p>
          </div>
        </section>

        <section className="py-24 border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {articles.map((article) => (
                <article
                  key={article.title}
                  className="group rounded-xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/60"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-500 mb-3">
                    <span className="rounded border border-neutral-200 px-2 py-0.5 uppercase dark:border-neutral-700">{article.tag}</span>
                    <span>{article.date} • {article.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-950 dark:text-neutral-50 mb-3 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6">
                    {article.summary}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    <span>Read Article</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
