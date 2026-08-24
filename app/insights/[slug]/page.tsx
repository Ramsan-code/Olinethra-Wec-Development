import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"
import AuthorshipBadge from "@/components/insights/AuthorshipBadge"
import AudienceCtaCard from "@/components/insights/AudienceCtaCard"
import { fetchPublicInsightBySlug } from "@/lib/insights"
import { ArrowLeft, Clock, Calendar, ArrowUpRight, Share2, BookOpen, Newspaper, Sparkles, CheckCircle2 } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchPublicInsightBySlug(slug)
  if (!data?.post) {
    return { title: "Insight Article Not Found | Olinethra" }
  }

  const post = data.post
  const seoTitle = post.seo?.title || `${post.title} | Olinethra Insights`
  const seoDesc = post.seo?.description || post.excerpt

  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      type: "article",
      url: `/insights/${post.slug}`,
      images: post.coverImage?.url ? [{ url: post.coverImage.url, alt: post.coverImage.alt || post.title }] : undefined,
    },
    alternates: {
      canonical: post.seo?.canonicalUrl || `/insights/${post.slug}`,
    },
  }
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params
  const data = await fetchPublicInsightBySlug(slug)

  if (!data?.post) {
    notFound()
  }

  const { post, related } = data
  const categoryName = typeof post.category === "object" ? post.category?.name : post.categoryName || "Engineering"

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        {/* Article Header / Hero */}
        <header className="border-b border-neutral-200 bg-neutral-950 py-16 text-white dark:border-neutral-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between font-mono text-xs text-neutral-400">
              <Link href="/insights" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Insights</span>
              </Link>
              <div className="flex items-center gap-3">
                <span>{categoryName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{post.readingTimeMinutes} min read</span>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                  post.type === "TECH_BRIEF"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "bg-neutral-800 text-neutral-300"
                }`}>
                  {post.type === "TECH_BRIEF" ? "⚡ TECH BRIEF" : "ARTICLE"}
                </span>

                {post.tags?.map((t) => (
                  <span key={t} className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-400">
                    #{t}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-neutral-300 leading-relaxed font-light">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                <AuthorshipBadge
                  authorship={post.authorship}
                  authorName={post.authorName}
                  authorRole={post.authorRole}
                />

                <div className="font-mono text-xs text-neutral-400 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage?.url && (
          <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-900">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
              <div className="rounded-2xl overflow-hidden border border-neutral-800 shadow-xl max-h-[440px]">
                <img src={post.coverImage.url} alt={post.coverImage.alt || post.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

        {/* Structured Tech Brief Header Section (If TECH_BRIEF) */}
        {post.type === "TECH_BRIEF" && post.source && (
          <section className="py-8 bg-blue-500/5 border-b border-neutral-200 dark:border-neutral-800">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex items-center justify-between border-b border-blue-500/20 pb-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                  <Newspaper className="h-4 w-4" />
                  <span>Curated Tech Brief Breakdown</span>
                </div>
                {post.source.url && (
                  <a
                    href={post.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-blue-500 hover:underline"
                  >
                    <span>Source: {post.source.name || "Original News"}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {post.source.whatHappened && (
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 space-y-2">
                    <h4 className="font-mono text-xs font-bold uppercase text-neutral-500">1. What Happened?</h4>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{post.source.whatHappened}</p>
                  </div>
                )}

                {post.source.whyItMatters && (
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 space-y-2">
                    <h4 className="font-mono text-xs font-bold uppercase text-neutral-500">2. Why It Matters?</h4>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{post.source.whyItMatters}</p>
                  </div>
                )}

                {post.source.whoShouldCare && (
                  <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 space-y-2">
                    <h4 className="font-mono text-xs font-bold uppercase text-neutral-500">3. Who Should Care?</h4>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{post.source.whoShouldCare}</p>
                  </div>
                )}
              </div>

              {post.source.commentary && (
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-5 space-y-2">
                  <h4 className="font-mono text-xs font-bold uppercase text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span>Olinethra Engineering Commentary</span>
                  </h4>
                  <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-mono">
                    {post.source.commentary}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Main Article Content Body */}
        <article className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="prose dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap font-sans text-neutral-800 dark:text-neutral-200">
              {post.content}
            </div>

            {/* Audience-Aware Call to Action */}
            <AudienceCtaCard postId={post.id} audience={post.audience} />
          </div>
        </article>

        {/* Related Insights Grid */}
        {related.length > 0 && (
          <section className="py-16 border-t border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/30">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-500">
                Related Articles & Briefs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/insights/${item.slug}`}
                    className="group rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all space-y-3"
                  >
                    <span className="font-mono text-[10px] text-neutral-400 uppercase">
                      {typeof item.category === "object" ? item.category?.name : item.categoryName || "Engineering"}
                    </span>
                    <h4 className="font-bold text-base text-neutral-950 dark:text-neutral-50 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {item.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
