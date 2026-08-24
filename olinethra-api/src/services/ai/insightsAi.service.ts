import { env } from "../../config/env.js"
import { AppError } from "../../middleware/error.middleware.js"

export interface GenerateDraftInput {
  topic: string
  type?: "ARTICLE" | "TECH_BRIEF"
  audience?: "CLIENTS" | "DEVELOPERS" | "BOTH"
  categoryName?: string
  tone?: string
  keyPoints?: string[]
  optionalSources?: string
  additionalInstructions?: string
}

export interface GeneratedArticleResult {
  title: string
  excerpt: string
  content: string
  suggestedCategory: string
  suggestedTags: string[]
  seoTitle: string
  seoDescription: string
  suggestedCTA: "CLIENTS" | "DEVELOPERS" | "BOTH"
}

export interface GenerateTechBriefInput {
  sourceUrl?: string
  sourceName?: string
  rawSourceText?: string
  headline?: string
  customNotes?: string
}

export interface GeneratedTechBriefResult {
  title: string
  excerpt: string
  whatHappened: string
  whyItMatters: string
  whoShouldCare: string
  olinethraCommentary: string
  suggestedCategory: string
  suggestedTags: string[]
}

export interface AiAssistInput {
  action:
    | "IMPROVE_WRITING"
    | "FIX_GRAMMAR"
    | "MAKE_CONCISE"
    | "EXPAND"
    | "GENERATE_EXAMPLE"
    | "SUGGEST_HEADING"
    | "IMPROVE_SEO"
    | "CREATE_EXCERPT"
  text: string
  contextTitle?: string
}

const SYSTEM_OLINETHRA_IDENTITY = `You are Gemini, writing as an AI Assistant for Olinethra (an engineering-first software studio specializing in Next.js, React 19, TypeScript, Express, MongoDB, and modern web systems).

STRICT COMPLIANCE & SAFETY RULES:
1. TONE & STYLE: Professional, technically credible, clear, practical, concise, modern, non-hype-driven.
2. BANNED HYPE BUZZWORDS: Do NOT use phrases like "revolutionary", "game-changing", "cutting-edge", "unprecedented", "transform your business overnight", or "groundbreaking" unless backed by literal facts.
3. ANTI-HALLUCINATION SAFEGUARD: You MUST NOT invent fictional Olinethra clients, client names, projects, employees, awards, office locations, revenue numbers, statistics, testimonials, partnerships, certifications, or pricing plans. If talking about Olinethra, speak strictly from a general engineering perspective without making up specific enterprise facts.
4. CODE BLOCKS: Provide concise, clean, syntactically valid TypeScript/React/Node.js code blocks when illustrating engineering concepts.
5. FORMAT: Always return RAW JSON adhering strictly to the requested schema. No markdown wrapping around the JSON (e.g. no triple backticks with json).`

export async function callGeminiApi(promptText: string): Promise<string> {
  if (!env.GEMINI_API_KEY) {
    throw new AppError(503, "GEMINI_NOT_CONFIGURED", "Gemini API key is not configured.")
  }

  const contents = [
    {
      role: "user",
      parts: [{ text: `${SYSTEM_OLINETHRA_IDENTITY}\n\nTask Instructions:\n${promptText}` }],
    },
  ]

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    }
  )

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    console.error("[INSIGHTS_AI] Gemini API HTTP Error:", res.status, errText)
    throw new AppError(502, "GEMINI_API_ERROR", "Failed to get response from Gemini AI service.")
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawText) {
    throw new AppError(500, "GEMINI_EMPTY_RESPONSE", "Gemini returned an empty response.")
  }

  return rawText
}

function cleanJsonText(rawText: string): string {
  let text = rawText.trim()
  if (text.startsWith("```json")) {
    text = text.slice(7)
  } else if (text.startsWith("```")) {
    text = text.slice(3)
  }
  if (text.endsWith("```")) {
    text = text.slice(0, -3)
  }
  return text.trim()
}

export async function generateInsightDraft(input: GenerateDraftInput): Promise<GeneratedArticleResult> {
  if (!input.topic) {
    throw new AppError(400, "MISSING_TOPIC", "A topic is required to generate an article draft.")
  }

  const keyPointsText = input.keyPoints?.length
    ? `Key Points to Include:\n- ${input.keyPoints.join("\n- ")}`
    : ""

  const prompt = `Generate a full draft for an Olinethra Insights article.

Topic: ${input.topic}
Type: ${input.type || "ARTICLE"}
Target Audience: ${input.audience || "BOTH"}
Category: ${input.categoryName || "Engineering"}
Tone: ${input.tone || "Professional, practical, and engineering-focused"}
${keyPointsText}
${input.optionalSources ? `Source References:\n${input.optionalSources}` : ""}
${input.additionalInstructions ? `Additional Instructions:\n${input.additionalInstructions}` : ""}

Required JSON Output Structure (Return ONLY valid JSON):
{
  "title": "Compelling, clear, engineering-grade title",
  "excerpt": "Concise 2-sentence summary suitable for article cards and meta tags",
  "content": "Full article body in Markdown format with subheadings (##), clean paragraphs, code snippets if applicable, and practical insights.",
  "suggestedCategory": "${input.categoryName || "Engineering"}",
  "suggestedTags": ["Tag1", "Tag2", "Tag3"],
  "seoTitle": "SEO title under 60 chars",
  "seoDescription": "Meta description under 155 chars",
  "suggestedCTA": "${input.audience || "BOTH"}"
}`

  const responseText = await callGeminiApi(prompt)
  const cleaned = cleanJsonText(responseText)

  try {
    const parsed = JSON.parse(cleaned) as GeneratedArticleResult
    if (!parsed.title || !parsed.content) {
      throw new Error("Missing required JSON fields")
    }
    return {
      title: parsed.title,
      excerpt: parsed.excerpt || parsed.title,
      content: parsed.content,
      suggestedCategory: parsed.suggestedCategory || input.categoryName || "Engineering",
      suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : [],
      seoTitle: parsed.seoTitle || parsed.title,
      seoDescription: parsed.seoDescription || parsed.excerpt || "",
      suggestedCTA: ["CLIENTS", "DEVELOPERS", "BOTH"].includes(parsed.suggestedCTA)
        ? parsed.suggestedCTA
        : "BOTH",
    }
  } catch (err) {
    console.error("[INSIGHTS_AI] Failed to parse Gemini draft JSON:", cleaned, err)
    throw new AppError(500, "AI_PARSE_ERROR", "Gemini response could not be parsed into structured format.")
  }
}

export async function generateTechBriefFromSource(input: GenerateTechBriefInput): Promise<GeneratedTechBriefResult> {
  if (!input.rawSourceText && !input.headline && !input.sourceUrl) {
    throw new AppError(400, "MISSING_SOURCE", "Source text, headline, or URL is required to generate a Tech Brief.")
  }

  const prompt = `Generate a curated Tech Brief for Olinethra Insights based on the following external source material.

Original Source Headline: ${input.headline || "N/A"}
Source URL: ${input.sourceUrl || "N/A"}
Source Name: ${input.sourceName || "Industry News"}
Raw Source Text / Summary:
${input.rawSourceText || "N/A"}

${input.customNotes ? `Olinethra Specific Perspective Notes:\n${input.customNotes}` : ""}

Tech Brief Structure Instructions:
- What Happened? (Factual, accurate 2-3 sentence summary of the news).
- Why It Matters? (Practical impact on software engineering, web tech, or business AI).
- Who Should Care? (Which teams or businesses are impacted).
- Olinethra Commentary (Olinethra's practical engineering perspective on how developers/clients should respond).

Required JSON Output Structure (Return ONLY valid JSON):
{
  "title": "Clear headline for the Tech Brief",
  "excerpt": "1-2 sentence executive overview",
  "whatHappened": "Factual overview",
  "whyItMatters": "Technical/business significance",
  "whoShouldCare": "Target audience impact",
  "olinethraCommentary": "Olinethra engineering team commentary",
  "suggestedCategory": "AI & Automation",
  "suggestedTags": ["Tech News", "AI", "Engineering"]
}`

  const responseText = await callGeminiApi(prompt)
  const cleaned = cleanJsonText(responseText)

  try {
    const parsed = JSON.parse(cleaned) as GeneratedTechBriefResult
    return {
      title: parsed.title || input.headline || "Tech Brief Update",
      excerpt: parsed.excerpt || parsed.whatHappened || "",
      whatHappened: parsed.whatHappened || "",
      whyItMatters: parsed.whyItMatters || "",
      whoShouldCare: parsed.whoShouldCare || "",
      olinethraCommentary: parsed.olinethraCommentary || "",
      suggestedCategory: parsed.suggestedCategory || "Emerging Technology",
      suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : ["Tech Brief"],
    }
  } catch (err) {
    console.error("[INSIGHTS_AI] Failed to parse Tech Brief JSON:", cleaned, err)
    throw new AppError(500, "AI_PARSE_ERROR", "Gemini response could not be parsed into Tech Brief format.")
  }
}

export async function aiAssistSection(input: AiAssistInput): Promise<string> {
  if (!input.text) {
    throw new AppError(400, "MISSING_TEXT", "Target text is required for AI assist.")
  }

  const prompt = `Perform the requested editorial assistance on the following text block.

Context / Article Title: ${input.contextTitle || "Olinethra Insights Article"}
Requested Action: ${input.action}

Input Text:
${input.text}

Action Descriptions:
- IMPROVE_WRITING: Polish clarity, phrasing, and flow while retaining technical accuracy.
- FIX_GRAMMAR: Fix typos, punctuation, and grammatical errors.
- MAKE_CONCISE: Trim fluff and deliver maximum information density.
- EXPAND: Elaborate with clear technical context and practical explanation.
- GENERATE_EXAMPLE: Add a practical code snippet or real-world usage scenario.
- SUGGEST_HEADING: Provide 3 strong markdown heading options for this section.
- IMPROVE_SEO: Rephrase to incorporate search-intent keywords naturally.
- CREATE_EXCERPT: Create a crisp 2-sentence summary.

Return ONLY the final modified text in Markdown format without meta-commentary.`

  return await callGeminiApi(prompt)
}
