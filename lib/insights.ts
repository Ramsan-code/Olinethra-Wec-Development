import { backendFetch } from "@/lib/backend-api"

export interface InsightCategoryItem {
  id: string
  name: string
  slug: string
  description?: string
  displayOrder: number
}

export interface InsightPostItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  type: "ARTICLE" | "TECH_BRIEF"
  authorship: "HUMAN" | "AI" | "HUMAN_AI"
  authorName: string
  authorRole?: string
  authorAvatar?: string
  ai?: {
    provider?: string
    model?: string
    generatedAt?: string
    reviewedBy?: string
    reviewedAt?: string
    promptSummary?: string
  }
  category?: {
    _id?: string
    name: string
    slug: string
  } | string
  categoryName?: string
  tags: string[]
  audience: "CLIENTS" | "DEVELOPERS" | "BOTH"
  coverImage?: {
    url: string
    publicId?: string
    alt?: string
  }
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
  featured: boolean
  readingTimeMinutes: number
  views: number
  ctaClicks: number
  source?: {
    name?: string
    url?: string
    publishedAt?: string
    commentary?: string
    whatHappened?: string
    whyItMatters?: string
    whoShouldCare?: string
  }
  seo?: {
    title?: string
    description?: string
    canonicalUrl?: string
  }
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface PublicInsightsResponse {
  posts: InsightPostItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PublicInsightDetailResponse {
  post: InsightPostItem
  related: InsightPostItem[]
}

// Fallback seed insights in case backend is offline/bootstrapping
export const FALLBACK_INSIGHTS: InsightPostItem[] = [
  {
    id: "insight-seed-1",
    title: "Optimizing Next.js 16 Core Web Vitals for Modern Enterprise Platforms",
    slug: "optimizing-nextjs-16-core-web-vitals",
    excerpt: "How we achieve sub-350ms initial paint times using Server Components, font optimization, streaming rendering, and minimal hydration bundles.",
    content: `## Achieving High-Performance Web Applications

In modern web development, speed and user experience dictate conversion rates and search rankings. With Next.js 16 and React 19, server rendering architecture has evolved to enable instant initial page load while preserving rich interactivity.

### Key Optimization Strategies

1. **Server Components First**: Keep client bundles minimal by rendering static and data-heavy parts on the server.
2. **Font & Image Optimization**: Leverage \`next/font\` and automated image optimization to eliminate layout shifts (CLS).
3. **Selective Hydration**: Only hydrate interactive UI components when visible in the viewport.

\`\`\`ts
// Example Server Component Pattern
export async function InsightHeader({ slug }: { slug: string }) {
  const data = await fetchInsightBySlug(slug)
  return (
    <header className="py-12 border-b border-neutral-800">
      <h1 className="text-4xl font-extrabold tracking-tight">{data.title}</h1>
    </header>
  )
}
\`\`\`

By adhering to these architectural standards, software teams can achieve sub-400ms load times across desktop and mobile networks.`,
    type: "ARTICLE",
    authorship: "HUMAN",
    authorName: "Olinethra Engineering Team",
    authorRole: "Software Architecture Studio",
    categoryName: "Engineering",
    tags: ["Next.js", "Performance", "React 19", "TypeScript"],
    audience: "BOTH",
    status: "PUBLISHED",
    featured: true,
    readingTimeMinutes: 6,
    views: 1420,
    ctaClicks: 48,
    publishedAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: "insight-seed-2",
    title: "Monochrome UI Design Systems: Visual Depth Without Color Clutter",
    slug: "monochrome-ui-design-systems",
    excerpt: "A deep dive into typography hierarchy, grid borders, and subtle opacity micro-interactions in high-end developer and enterprise interfaces.",
    content: `## The Craft of Monochrome UI

Designing sophisticated monochrome interfaces requires intentional focus on typography weight, border density, contrast ratios, and spatial hierarchy.

### Principles of Visual Rhythm

- **Hierarchical Contrast**: Use stark contrast for headers (#09090b vs #ffffff) and soft grays (#737373) for metadata.
- **Border Grids**: Define structural section bounds with thin 1px borders to organize complex data without background noise.
- **Purposeful Micro-Interactions**: Subtle hover opacity transitions build a tactile feel without distracting user attention.`,
    type: "ARTICLE",
    authorship: "HUMAN",
    authorName: "Olinethra Design Studio",
    authorRole: "UI/UX Architecture",
    categoryName: "Web Development",
    tags: ["Design Systems", "UI/UX", "Tailwind CSS", "Frontend"],
    audience: "DEVELOPERS",
    status: "PUBLISHED",
    featured: false,
    readingTimeMinutes: 5,
    views: 890,
    ctaClicks: 22,
    publishedAt: "2026-08-12T14:30:00.000Z",
  },
  {
    id: "insight-seed-3",
    title: "Tech Brief: Google Gemini 2.0 Flash & Modern AI Workflow Integration",
    slug: "tech-brief-gemini-2-flash-workflow-integration",
    excerpt: "Google released Gemini 2.0 Flash with sub-second response latencies and structured outputs. Here is Olinethra's analysis for production web software.",
    content: `## Industry Overview

Google has released Gemini 2.0 Flash, optimizing inference latency and structured output JSON accuracy for real-time applications.

### What Happened?
Gemini 2.0 Flash delivers high token throughput at reduced latency, enabling applications to run real-time conversational agents, document parsing, and automated drafting seamlessly.

### Why It Matters
For software development teams, lower inference latency means AI can be embedded directly into user input workflows without causing noticeable UI delays.

### Olinethra Perspective
We recommend adopting structured JSON schema enforcement and mandatory human-in-the-loop review for all AI-generated public content. Autonomous publishing should be avoided in favor of transparent collaborative human + AI workflows.`,
    type: "TECH_BRIEF",
    authorship: "HUMAN_AI",
    authorName: "Olinethra AI & Engineering Team",
    authorRole: "AI Architecture",
    categoryName: "AI & Automation",
    tags: ["AI", "Gemini", "LLM", "Tech Brief"],
    audience: "BOTH",
    status: "PUBLISHED",
    featured: true,
    readingTimeMinutes: 4,
    views: 2150,
    ctaClicks: 75,
    source: {
      name: "Google AI Blog",
      url: "https://blog.google/technology/ai/",
      whatHappened: "Google announced Gemini 2.0 Flash with sub-second latency and enhanced structured output mode.",
      whyItMatters: "Faster inference enables real-time agentic workflows and interactive software applications.",
      whoShouldCare: "Product leaders, full-stack engineers, and AI developers.",
      commentary: "Olinethra recommends using Gemini for idea drafting, SEO suggestions, and summary extraction while maintaining strict human-in-the-loop approval before publication.",
    },
    publishedAt: "2026-08-20T09:15:00.000Z",
  },
]

export async function fetchPublicInsights(params: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  type?: string
  audience?: string
  search?: string
}): Promise<PublicInsightsResponse> {
  try {
    const query = new URLSearchParams()
    if (params.page) query.set("page", params.page.toString())
    if (params.limit) query.set("limit", params.limit.toString())
    if (params.category) query.set("category", params.category)
    if (params.tag) query.set("tag", params.tag)
    if (params.type) query.set("type", params.type)
    if (params.audience) query.set("audience", params.audience)
    if (params.search) query.set("search", params.search)

    const res = await backendFetch(`/insights?${query.toString()}`)
    if (res.ok) {
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        return {
          posts: data.data,
          pagination: data.pagination || { page: 1, limit: 10, total: data.data.length, totalPages: 1 },
        }
      }
    }
  } catch (err) {
    console.error("[INSIGHTS_FETCH] Error fetching public insights:", err)
  }

  // Return fallback insights filtered by type/category if backend is starting
  let filtered = FALLBACK_INSIGHTS
  if (params.type) filtered = filtered.filter((p) => p.type === params.type)
  return {
    posts: filtered,
    pagination: { page: 1, limit: 10, total: filtered.length, totalPages: 1 },
  }
}

export async function fetchPublicInsightBySlug(slug: string): Promise<PublicInsightDetailResponse | null> {
  try {
    const res = await backendFetch(`/insights/${encodeURIComponent(slug)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.data?.post) {
        return data.data
      }
    }
  } catch (err) {
    console.error("[INSIGHT_DETAIL_FETCH] Error fetching insight by slug:", err)
  }

  // Fallback check
  const fallbackPost = FALLBACK_INSIGHTS.find((p) => p.slug === slug)
  if (fallbackPost) {
    const related = FALLBACK_INSIGHTS.filter((p) => p.slug !== slug).slice(0, 2)
    return { post: fallbackPost, related }
  }

  return null
}
