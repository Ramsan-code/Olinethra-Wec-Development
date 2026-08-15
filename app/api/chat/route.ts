import { NextResponse } from "next/server"
import { getCmsData } from "@/lib/cms"
import { queryKnowledgeBase } from "@/data/knowledgeBase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages: Array<{ role: "user" | "assistant"; content: string }> = body.messages || []

    if (!messages.length) {
      return NextResponse.json(
        { response: "Hello! How can I assist you with Olinethra's services today?" },
        { status: 400 }
      )
    }

    const latestUserMessage = messages[messages.length - 1].content.trim()
    const cms = getCmsData()

    // Build dynamic live knowledge snapshot from CMS
    const liveKnowledgeSnapshot = {
      company: {
        name: "Olinethra",
        tagline: cms.siteSettings.footerTagline,
        heroHeading: cms.siteSettings.heroHeading,
        heroSubheading: cms.siteSettings.heroSubheading,
        contactEmail: cms.siteSettings.contactEmail,
        contactPhone: cms.siteSettings.contactPhone,
        address: cms.siteSettings.contactAddress,
      },
      services: cms.services.filter((s) => s.status === "Active"),
      internships: cms.internships.map((i) => ({
        title: i.title,
        status: i.status,
        deadline: i.deadline,
        location: i.location,
        workType: i.workType,
      })),
      jobs: cms.jobs.map((j) => ({
        title: j.title,
        status: j.status,
        location: j.location,
      })),
      team: cms.team.filter((t) => t.status === "Active").map((t) => ({ name: t.name, role: t.role })),
      projects: cms.projects.filter((p) => p.status === "Published").map((p) => ({ title: p.title, category: p.category, client: p.client })),
      faqs: cms.faqs.filter((f) => f.published),
      customChatbotKnowledge: cms.chatbotKnowledge,
    }

    // 1. Check for specific dynamic queries (e.g. internships, jobs, live FAQs)
    const lowerMessage = latestUserMessage.toLowerCase()

    if (lowerMessage.includes("internship") || lowerMessage.includes("intern")) {
      const activeInternships = cms.internships.filter((i) => i.status === "Open")
      const closedInternships = cms.internships.filter((i) => i.status === "Closed")

      let reply = ""
      if (activeInternships.length > 0) {
        reply = `Olinethra currently has ${activeInternships.length} Open internship position(s):\n` +
          activeInternships.map((i) => `• ${i.title} (${i.workType}, Deadline: ${i.deadline})`).join("\n") +
          `\n\nYou can apply directly via our Careers page.`
      } else {
        reply = `All internship positions are currently Closed.`
      }

      if (closedInternships.length > 0 && activeInternships.length === 0) {
        reply += ` (${closedInternships.map((i) => i.title).join(", ")} are currently closed).`
      }

      return NextResponse.json({
        response: reply,
        suggestedAction: { text: "Explore Careers & Internships →", href: "/careers" },
      })
    }

    // Check custom chatbot knowledge added by admin
    const customMatch = cms.chatbotKnowledge.find(
      (k) =>
        lowerMessage.includes(k.question.toLowerCase()) ||
        k.question.toLowerCase().includes(lowerMessage)
    )
    if (customMatch) {
      return NextResponse.json({
        response: customMatch.answer,
      })
    }

    // 2. Check if Gemini API key is present
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (geminiApiKey) {
      try {
        const systemPrompt = `You are Olinethra's AI Chatbot Assistant. You assist website visitors with questions about Olinethra.

Strict Rules:
- Prioritize information from the LIVE CMS KNOWLEDGE BASE below.
- Keep responses concise, clear, and professional.
- Do NOT invent exact prices or hallucinate details.
- Guide users to contact engineering if asking about custom quotes or projects.

LIVE CMS KNOWLEDGE BASE:
${JSON.stringify(liveKnowledgeSnapshot, null, 2)}`

        const contents = [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          ...messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
        ]

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents }),
          }
        )

        if (res.ok) {
          const data = await res.json()
          const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || null

          if (aiReply) {
            let suggestedAction: { text: string; href: string } | undefined
            const lowerReply = aiReply.toLowerCase()
            if (
              lowerReply.includes("contact") ||
              lowerReply.includes("start a project") ||
              lowerReply.includes("quote")
            ) {
              suggestedAction = { text: "Let's discuss your project →", href: "/contact" }
            }

            return NextResponse.json({
              response: aiReply,
              suggestedAction,
            })
          }
        }
      } catch (err) {
        console.error("Gemini API call error, falling back to Knowledge Base matcher:", err)
      }
    }

    // 3. Fallback to queryKnowledgeBase
    const matched = queryKnowledgeBase(latestUserMessage)
    return NextResponse.json({
      response: matched.answer,
      suggestedAction: matched.suggestedAction,
    })
  } catch (error) {
    console.error("Chatbot API Error:", error)
    return NextResponse.json(
      {
        response:
          "I apologize, but I encountered an error processing your request. Please reach out to our team at hello@olinethra.com.",
        suggestedAction: { text: "Let's discuss your project →", href: "/contact" },
      },
      { status: 500 }
    )
  }
}
