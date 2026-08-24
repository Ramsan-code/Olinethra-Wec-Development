import {
  Project,
  Service,
  TeamMember,
  Faq,
  Internship,
  Job,
  ChatbotKnowledge,
  SiteSettings,
} from "../models/index.js"
import { env } from "../config/env.js"
import { saveCmsSnapshot } from "./cms.service.js"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatResponse {
  response: string
  suggestedAction?: { text: string; href: string }
}

export async function handleChat(messages: ChatMessage[]): Promise<ChatResponse> {
  if (!messages.length) {
    return {
      response: "Hello! How can I assist you with Olinethra's software engineering services today?",
    }
  }

  const latestUserMessage = messages[messages.length - 1].content.trim()
  const lowerMessage = latestUserMessage.toLowerCase()
  const cms = await saveCmsSnapshot()
  const services = cms.services as Array<{ title: string; shortDesc?: string; status: string }>
  const knowledge = cms.chatbotKnowledge as Array<{ question: string; answer: string }>

  if (
    lowerMessage.includes("store") ||
    lowerMessage.includes("e-commerce") ||
    lowerMessage.includes("ecommerce") ||
    lowerMessage.includes("shop") ||
    lowerMessage.includes("payment")
  ) {
    const ecomService =
      services.find((s) => s.title.toLowerCase().includes("e-commerce")) || services[0]
    return {
      response: `Based on your request, here is our Recommended Olinethra Service:\n\n🛍️ **${ecomService?.title || "E-Commerce Development"}**\n${ecomService?.shortDesc || "Custom high-converting e-commerce web applications."}`,
      suggestedAction: { text: "Start a Project →", href: "/contact" },
    }
  }

  if (
    lowerMessage.includes("app") ||
    lowerMessage.includes("dashboard") ||
    lowerMessage.includes("saas") ||
    lowerMessage.includes("portal")
  ) {
    const webAppService =
      services.find((s) => s.title.toLowerCase().includes("application")) || services[0]
    return {
      response: `Based on your requirements:\n\n💻 **${webAppService?.title || "Full-Stack Web Application Development"}**\n${webAppService?.shortDesc || "Custom web software engineered with Next.js and Node.js."}`,
      suggestedAction: { text: "Start a Project →", href: "/contact" },
    }
  }

  if (
    lowerMessage.includes("location") ||
    lowerMessage.includes("address") ||
    lowerMessage.includes("where are you") ||
    lowerMessage.includes("where is your office") ||
    lowerMessage.includes("office location") ||
    lowerMessage.includes("map") ||
    lowerMessage.includes("directions")
  ) {
    const loc = (cms.siteSettings as Record<string, any>)?.location
    const locName = loc?.name || "Olinethra"
    const city = loc?.city || "Vavuniya"
    const country = loc?.country || "Sri Lanka"
    const addr1 = loc?.addressLine1 ? `${loc.addressLine1}, ` : ""
    const mapsUrl = loc?.googleMapsUrl || `https://maps.google.com/?q=${loc?.latitude || 8.7514},${loc?.longitude || 80.4971}`

    return {
      response: `📍 **${locName} Location:**\n${addr1}${city}, ${country}\n\nVisit us or get directions: ${mapsUrl}`,
      suggestedAction: { text: "Open in Google Maps →", href: mapsUrl },
    }
  }

  if (lowerMessage.includes("internship") || lowerMessage.includes("intern") || lowerMessage.includes("hiring")) {

    const activeInternships = cms.internships.filter((i) => i.status === "Open")
    const activeJobs = cms.jobs.filter((j) => j.status === "Open")

    let reply = ""
    if (activeInternships.length > 0) {
      reply =
        `Olinethra currently has ${activeInternships.length} Open internship position(s):\n` +
        activeInternships.map((i) => `• ${i.title} (${i.workType}, Deadline: ${i.deadline})`).join("\n")
    } else {
      reply = "All developer internship positions are currently Closed for this cohort."
    }

    if (activeJobs.length > 0) {
      reply +=
        `\n\nWe also have ${activeJobs.length} Open Full-Time Role(s):\n` +
        activeJobs.map((j) => `• ${j.title} (${j.employmentType}, ${j.workType})`).join("\n")
    }

    return {
      response: reply + "\n\nYou can review details and apply on our Careers page.",
      suggestedAction: { text: "View Careers & Opportunities →", href: "/careers" },
    }
  }

  const customMatch = knowledge.find(
    (k) =>
      lowerMessage.includes(k.question.toLowerCase()) ||
      k.question.toLowerCase().includes(lowerMessage)
  )
  if (customMatch) {
    return { response: customMatch.answer }
  }

  if (env.GEMINI_API_KEY) {
    try {
      const liveKnowledgeSnapshot = {
        company: cms.siteSettings,
        services: cms.services.filter((s) => s.status === "Active"),
        internships: cms.internships.filter((i) => i.status === "Open"),
        jobs: cms.jobs.filter((j) => j.status === "Open"),
        team: cms.team.filter((t) => t.status === "Active").map((t) => ({ name: t.name, role: t.role })),
        projects: cms.projects
          .filter((p) => p.status === "Published")
          .map((p) => ({ title: p.title, category: p.category })),
        faqs: cms.faqs.filter((f) => f.published),
      }

      const systemPrompt = `You are Olinethra's AI Chatbot Assistant.
Strict Rules:
- Prioritize information from the LIVE CMS KNOWLEDGE BASE below.
- Do NOT invent exact prices, employees, projects, or jobs.
- If information is unavailable, say: "I don't have that information yet. Please contact the Olinethra team."
- Keep responses concise and professional.

LIVE CMS KNOWLEDGE BASE:
${JSON.stringify(liveKnowledgeSnapshot, null, 2)}`

      const contents = [
        { role: "user", parts: [{ text: systemPrompt }] },
        ...messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      ]

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      )

      if (res.ok) {
        const data = (await res.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
        }
        const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (aiReply) {
          return {
            response: aiReply,
            suggestedAction: { text: "Start a Project →", href: "/contact" },
          }
        }
      }
    } catch (err) {
      console.error("[CHAT] Gemini error:", err)
    }
  }

  return {
    response:
      "I don't have that information yet. Please contact the Olinethra team at hello@olinethra.com or visit our contact page.",
    suggestedAction: { text: "Start a Project →", href: "/contact" },
  }
}

// Re-export for chat service internal use - avoid circular by importing models directly in chat
export { Project, Service, TeamMember, Faq, Internship, Job, ChatbotKnowledge, SiteSettings }
