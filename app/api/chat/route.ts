import { NextResponse } from "next/server"
import { getCmsData, saveCmsData } from "@/lib/cms"
import { queryKnowledgeBase } from "@/data/knowledgeBase"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages: Array<{ role: "user" | "assistant"; content: string }> = body.messages || []

    if (!messages.length) {
      return NextResponse.json(
        { response: "Hello! How can I assist you with Olinethra's software engineering services today?" },
        { status: 400 }
      )
    }

    const latestUserMessage = messages[messages.length - 1].content.trim()
    const lowerMessage = latestUserMessage.toLowerCase()
    const cms = getCmsData()

    // Log Activity / FAQ Discovery Automation
    try {
      if (!cms.activityLog) cms.activityLog = []
      cms.activityLog.unshift({
        id: `act-${Date.now()}`,
        user: "Visitor (Chatbot)",
        action: `Asked: "${latestUserMessage.slice(0, 50)}..."`,
        entity: "Chatbot",
        date: new Date().toISOString(),
      })
      // Keep activity log capped at 100 items
      if (cms.activityLog.length > 100) cms.activityLog = cms.activityLog.slice(0, 100)
      saveCmsData(cms)
    } catch (e) {
      // Non-blocking logger
    }

    // 1. Smart Service Recommendation Automation
    if (
      lowerMessage.includes("store") ||
      lowerMessage.includes("e-commerce") ||
      lowerMessage.includes("ecommerce") ||
      lowerMessage.includes("shop") ||
      lowerMessage.includes("payment")
    ) {
      const ecomService = cms.services.find((s) => s.title.toLowerCase().includes("e-commerce")) || cms.services[0]
      return NextResponse.json({
        response: `Based on your request, here is our Recommended Olinethra Service:\n\n🛍️ **${ecomService?.title || "E-Commerce Development"}**\n${ecomService?.shortDesc || "Custom high-converting e-commerce web applications built with Next.js, Stripe, and modern headless CMS architecture."}\n\nRecommended Features:\n• Custom product catalog & filters\n• Secure Stripe/PayPal checkout\n• Real-time inventory & admin order management\n• Fast checkout performance (<1s load time)`,
        suggestedAction: { text: "Start a Project →", href: "/contact" },
      })
    }

    if (
      lowerMessage.includes("app") ||
      lowerMessage.includes("dashboard") ||
      lowerMessage.includes("saas") ||
      lowerMessage.includes("portal")
    ) {
      const webAppService = cms.services.find((s) => s.title.toLowerCase().includes("application")) || cms.services[0]
      return NextResponse.json({
        response: `Based on your requirements, here is our Recommended Olinethra Service:\n\n💻 **${webAppService?.title || "Full-Stack Web Application Development"}**\n${webAppService?.shortDesc || "Custom web software engineered with Next.js, Node.js, and PostgreSQL for maximum scalability."}\n\nRecommended Features:\n• Multi-role authentication & permissions\n• Custom administrative dashboard\n• Optimized database & API endpoints\n• 100% full source code ownership transfer`,
        suggestedAction: { text: "Start a Project →", href: "/contact" },
      })
    }

    // 2. AI Project Brief Generator Automation
    if (lowerMessage.includes("brief") || lowerMessage.includes("generate proposal") || lowerMessage.includes("requirements")) {
      return NextResponse.json({
        response: `📋 **Olinethra AI Project Brief Generator**\n\nTo generate your tailored project brief, please let us know:\n1. What product/app are you looking to build?\n2. Who is your target audience?\n3. Do you need user accounts/authentication or payments?\n4. What is your expected target launch deadline?\n\nOnce submitted via our Contact form, our lead engineer will send a complete technical proposal.`,
        suggestedAction: { text: "Create Project Brief →", href: "/contact" },
      })
    }

    // 3. Internship & Jobs Dynamic Check
    if (lowerMessage.includes("internship") || lowerMessage.includes("intern") || lowerMessage.includes("hiring")) {
      const activeInternships = cms.internships.filter((i) => i.status === "Open")
      const activeJobs = cms.jobs.filter((j) => j.status === "Open")

      let reply = ""
      if (activeInternships.length > 0) {
        reply = `Olinethra currently has ${activeInternships.length} Open internship position(s):\n` +
          activeInternships.map((i) => `• ${i.title} (${i.workType}, Deadline: ${i.deadline})`).join("\n")
      } else {
        reply = `All developer internship positions are currently Closed for this cohort.`
      }

      if (activeJobs.length > 0) {
        reply += `\n\nWe also have ${activeJobs.length} Open Full-Time Role(s):\n` +
          activeJobs.map((j) => `• ${j.title} (${j.employmentType}, ${j.workType})`).join("\n")
      }

      return NextResponse.json({
        response: reply + `\n\nYou can review details and apply on our Careers page.`,
        suggestedAction: { text: "View Careers & Opportunities →", href: "/careers" },
      })
    }

    // 4. Custom Chatbot Knowledge Matcher
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

    // 5. Gemini API Key fallback if configured
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (geminiApiKey) {
      try {
        const liveKnowledgeSnapshot = {
          company: cms.siteSettings,
          services: cms.services.filter((s) => s.status === "Active"),
          internships: cms.internships.filter((i) => i.status === "Open"),
          jobs: cms.jobs.filter((j) => j.status === "Open"),
          team: cms.team.filter((t) => t.status === "Active").map((t) => ({ name: t.name, role: t.role })),
          projects: cms.projects.filter((p) => p.status === "Published").map((p) => ({ title: p.title, category: p.category })),
          faqs: cms.faqs.filter((f) => f.published),
        }

        const systemPrompt = `You are Olinethra's AI Chatbot Assistant. Assist visitors with services, team, process, and tech stack.
Strict Rules:
- Prioritize information from the LIVE CMS KNOWLEDGE BASE below.
- Keep responses concise, clear, and professional.
- Do NOT invent exact prices or hallucinate details.
- Guide users to contact engineering for custom proposals.

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
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents }),
          }
        )

        if (res.ok) {
          const data = await res.json()
          const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (aiReply) {
            return NextResponse.json({
              response: aiReply,
              suggestedAction: { text: "Start a Project →", href: "/contact" },
            })
          }
        }
      } catch (err) {
        console.error("Gemini API error:", err)
      }
    }

    // 6. Local Fallback Matcher
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
          "I am having trouble processing your query right now. Please reach out directly to our engineering team at hello@olinethra.com.",
        suggestedAction: { text: "Start a Project →", href: "/contact" },
      },
      { status: 500 }
    )
  }
}
