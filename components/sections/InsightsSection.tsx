import * as React from "react"
import Link from "next/link"
import AuthorshipBadge from "@/components/insights/AuthorshipBadge"
import { fetchPublicInsights } from "@/lib/insights"
import { BookOpen, ArrowUpRight, Clock, Sparkles } from "lucide-react"

export default async function InsightsSection() {
  const { posts } = await fetchPublicInsights({ limit: 3 })

  if (!posts || posts.length === 0) return null

  return (
    <section id="insights" className="py-24 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-neutral-500 uppercase tracking-widest">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span>[ OLINETHRA INSIGHTS ]</span>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-neutral-950 dark:text-neutral-50">
              Web Systems, AI & Tech Briefs
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
              Practical engineering insights, Next.js 16 architecture papers, and AI developments by our engineering studio.
            </p>
          </div>

          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-950 dark:text-neutral-50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <span>Explore All Insights</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => {
            const categoryName = typeof post.category === "object" ? post.category?.name : post.categoryName || "Engineering"
            return (
              <article
                key={post.id}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 transition-all"
              >
                <div className="space-y-4">
                  {post.coverImage?.url && (
                    <div className="rounded-xl overflow-hidden max-h-40 mb-2">
                      <img
                        src={post.coverImage.url}
                        alt={post.coverImage.alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500">
                    <span className="rounded bg-neutral-100 px-2 py-0.5 uppercase font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {categoryName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readingTimeMinutes} min</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <Link href={`/insights/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                  <AuthorshipBadge
                    authorship={post.authorship}
                    authorName={post.authorName}
                    authorRole={post.authorRole}
                  />

                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-neutral-400 text-[10px]">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Recent"}
                    </span>

                    <Link
                      href={`/insights/${post.slug}`}
                      className="inline-flex items-center gap-1 font-bold text-neutral-950 dark:text-neutral-50 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
