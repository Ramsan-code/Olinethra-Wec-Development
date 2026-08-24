import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"
import AuthorshipBadge from "@/components/insights/AuthorshipBadge"
import AudienceCtaCard from "@/components/insights/AudienceCtaCard"
import { fetchPublicInsights } from "@/lib/insights"
import { BookOpen, Search, ArrowUpRight, Newspaper, Sparkles, Clock, Tag } from "lucide-react"

export const metadata: Metadata = {
  title: "Olinethra Insights — Web Systems, Gemini AI & Engineering Briefs",
  description: "Technical writings, Gemini AI research, architecture case studies, and curated tech briefs by Olinethra Software Studio.",
  openGraph: {
    title: "Olinethra Insights",
    description: "Technical writings, Gemini AI research, architecture case studies, and tech briefs by Olinethra.",
    type: "website",
    url: "/insights",
  },
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    tag?: string
    type?: string
    audience?: string
    search?: string
    page?: string
  }>
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || "1", 10)

  const { posts, pagination } = await fetchPublicInsights({
    page,
    limit: 12,
    category: params.category,
    tag: params.tag,
    type: params.type,
    audience: params.audience,
    search: params.search,
  })

  const featuredPost = posts.find((p) => p.featured) || posts[0]
  const listPosts = featuredPost ? posts.filter((p) => p.id !== featuredPost.id) : posts

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-neutral-200 bg-neutral-950 py-20 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400 uppercase tracking-widest">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <span>[ OLINETHRA INSIGHTS HUB ]</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Web Systems, AI & Tech Briefs
            </h1>

            <p className="max-w-2xl text-lg text-neutral-300 leading-relaxed">
              Engineering deep dives into Next.js 16, React 19, Gemini AI workflows, and curated tech news — written for clients and software engineers.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-4 font-mono text-xs">
              <Link
                href="/insights"
                className={`rounded-full px-4 py-1.5 transition-all ${
                  !params.type && !params.category
                    ? "bg-white text-neutral-950 font-bold"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                All Insights
              </Link>
              <Link
                href="/insights?type=ARTICLE"
                className={`rounded-full px-4 py-1.5 transition-all ${
                  params.type === "ARTICLE"
                    ? "bg-white text-neutral-950 font-bold"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                Articles
              </Link>
              <Link
                href="/insights?type=TECH_BRIEF"
                className={`rounded-full px-4 py-1.5 transition-all ${
                  params.type === "TECH_BRIEF"
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                ⚡ Tech Briefs
              </Link>
              <Link
                href="/insights?category=ai-automation"
                className={`rounded-full px-4 py-1.5 transition-all ${
                  params.category === "ai-automation"
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                ✨ AI & Automation
              </Link>
              <Link
                href="/insights?audience=DEVELOPERS"
                className={`rounded-full px-4 py-1.5 transition-all ${
                  params.audience === "DEVELOPERS"
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                For Engineers
              </Link>
            </div>
          </div>
        </section>

        {/* From the Founder Block (Secondary External Section) */}
        <section className="border-b border-neutral-200 bg-neutral-50/50 py-8 dark:border-neutral-800 dark:bg-neutral-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold">
                  <BookOpen className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                  <span>[ FROM THE FOUNDER ]</span>
                </div>
                <h2 className="text-xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight">
                  Thoughts on engineering, technology and building software.
                </h2>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Personal writing and architectural notes by Founder &amp; Lead Developer Thavam Ramsan. Published externally on Medium.
                </p>
              </div>

              <a
                href="https://medium.com/@thavamramsan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 shrink-0 rounded-xl border border-neutral-950 bg-neutral-950 px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-neutral-800 dark:border-neutral-100 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
                aria-label="Read founder's writing on Medium"
              >
                <span>Read on Medium</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Featured Hero Banner */}
        {featuredPost && (
          <section className="border-b border-neutral-200 py-16 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm transition-all hover:border-neutral-400 dark:hover:border-neutral-700">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Featured {featuredPost.type}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      {typeof featuredPost.category === "object" ? featuredPost.category?.name : featuredPost.categoryName || "Engineering"}
                    </span>
                    <span className="font-mono text-xs text-neutral-400">
                      • {featuredPost.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-neutral-950 dark:text-neutral-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    <Link href={`/insights/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <AuthorshipBadge
                      authorship={featuredPost.authorship}
                      authorName={featuredPost.authorName}
                      authorRole={featuredPost.authorRole}
                    />

                    <Link
                      href={`/insights/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-neutral-950 dark:text-neutral-50 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Insight</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {featuredPost.coverImage?.url ? (
                  <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 max-h-72">
                    <img
                      src={featuredPost.coverImage.url}
                      alt={featuredPost.coverImage.alt || featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="lg:col-span-5 rounded-2xl bg-neutral-950 p-8 flex flex-col justify-between min-h-[220px] text-white">
                    <BookOpen className="h-8 w-8 text-neutral-400" />
                    <div className="font-mono text-xs text-neutral-400">
                      Olinethra Architecture Paper
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Main Insights Grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-500">
                Latest Articles & Tech Briefs ({pagination.total})
              </h2>
            </div>

            {listPosts.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <BookOpen className="mx-auto h-8 w-8 text-neutral-400" />
                <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  No insights found for this filter.
                </p>
                <Link href="/insights" className="font-mono text-xs text-emerald-500 underline">
                  Reset Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listPosts.map((post) => {
                  const categoryName = typeof post.category === "object" ? post.category?.name : post.categoryName || "Engineering"
                  return (
                    <article
                      key={post.id}
                      className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/60 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 transition-all"
                    >
                      <div className="space-y-4">
                        {post.coverImage?.url && (
                          <div className="rounded-xl overflow-hidden max-h-48 mb-3">
                            <img
                              src={post.coverImage.url}
                              alt={post.coverImage.alt || post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-neutral-500">
                          <span className={`rounded px-2 py-0.5 uppercase font-bold ${
                            post.type === "TECH_BRIEF"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                              : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                          }`}>
                            {post.type === "TECH_BRIEF" ? "⚡ TECH BRIEF" : categoryName}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readingTimeMinutes} min read</span>
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
            )}

            {/* Audience Conversion Card */}
            <AudienceCtaCard audience="BOTH" />
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
