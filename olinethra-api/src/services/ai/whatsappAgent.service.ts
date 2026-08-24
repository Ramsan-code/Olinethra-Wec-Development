import { saveCmsSnapshot } from "../cms.service.js"
import { Lead, Conversation, Notification } from "../../models/index.js"
import { env } from "../../config/env.js"
import { generateLegacyId } from "../../utils/helpers.js"
import type { IConversation } from "../../models/Conversation.js"

export interface AgentProcessingResult {
  reply: string
  leadCreatedOrUpdated?: boolean
  humanHandoffTriggered?: boolean
  intent?: string
}

export async function processWhatsAppMessage(
  conversation: IConversation,
  userMessageText: string
): Promise<AgentProcessingResult> {
  const text = userMessageText.trim()
  const lower = text.toLowerCase()

  // 1. Human handoff request check
  if (
    lower === "6" ||
    lower.includes("human") ||
    lower.includes("person") ||
    lower.includes("talk to team") ||
    lower.includes("speak to team") ||
    lower.includes("agent") ||
    lower.includes("representative") ||
    lower.includes("real person")
  ) {
    conversation.aiEnabled = false
    conversation.status = "HUMAN_HANDOFF"
    await conversation.save()

    if (conversation.leadId) {
      await Lead.findByIdAndUpdate(conversation.leadId, { status: "HUMAN_HANDOFF" }).catch(() => null)
    }

    Notification.create({
      legacyId: generateLegacyId("notif"),
      type: "inquiry",
      title: "WhatsApp Human Handoff Requested",
      message: `User ${conversation.displayName} (${conversation.phone}) requested human assistance on WhatsApp.`,
      date: new Date().toISOString(),
      read: false,
      link: "/admin/whatsapp",
    }).catch(() => null)


    return {
      reply: "I'll pass this conversation to the Olinethra team so someone can continue with you directly. A team member will reply shortly.",
      humanHandoffTriggered: true,
      intent: "HUMAN_REQUEST",
    }
  }

  // Fetch fresh CMS snapshot for live data (Anti-stale knowledge rule)
  const cms = await saveCmsSnapshot()

  const services = cms.services as Array<{ title: string; shortDesc?: string; status: string }>
  const internships = cms.internships as Array<{ title: string; status: string; workType: string; duration: string; deadline: string; applicationLink?: string }>
  const jobs = cms.jobs as Array<{ title: string; status: string; employmentType: string; workType: string; location: string; applicationUrl?: string }>
  const projects = cms.projects as Array<{ title: string; category: string; description: string; status: string }>
  const faqs = cms.faqs as Array<{ question: string; answer: string; published: boolean }>
  const chatbotKnowledge = cms.chatbotKnowledge as Array<{ question: string; answer: string }>


  // 2. Simple greetings & menu
  if (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey" ||
    lower === "start" ||
    lower === "menu" ||
    lower === "help"
  ) {
    return {
      reply: `Hi 👋 Welcome to Olinethra.\n\nI can help with:\n\n1. Start a project\n2. Our services\n3. Portfolio & case studies\n4. Internship opportunities\n5. Job opportunities\n6. Talk to our team\n\nFeel free to type a number or describe what you're looking for in plain text.`,
      intent: "GREETING",
    }
  }

  // Location Inquiry
  if (
    lower.includes("location") ||
    lower.includes("address") ||
    lower.includes("office") ||
    lower.includes("where are you") ||
    lower.includes("where is your office") ||
    lower.includes("map") ||
    lower.includes("directions")
  ) {
    const loc = (cms.siteSettings as Record<string, any>)?.location
    const locName = loc?.name || "Olinethra"
    const city = loc?.city || "Vavuniya"
    const country = loc?.country || "Sri Lanka"
    const addr1 = loc?.addressLine1 ? `${loc.addressLine1}, ` : ""
    const mapsUrl = loc?.googleMapsUrl || `https://maps.google.com/?q=${loc?.latitude || 8.7514},${loc?.longitude || 80.4971}`

    return {
      reply: `📍 **${locName} Office Location:**\n${addr1}${city}, ${country}\n\nGoogle Maps & Directions:\n${mapsUrl}`,
      intent: "LOCATION",
    }
  }

  // 3. Careers / Internships / Jobs (Option 4 / 5 or keyword)

  if (
    lower === "4" ||
    lower === "5" ||
    lower.includes("internship") ||
    lower.includes("intern") ||
    lower.includes("job") ||
    lower.includes("hiring") ||
    lower.includes("careers") ||
    lower.includes("vacancies")
  ) {
    const openInternships = internships.filter((i) => i.status === "Open")
    const openJobs = jobs.filter((j) => j.status === "Open")

    let replyText = ""

    if (lower === "4" || lower.includes("intern")) {
      if (openInternships.length > 0) {
        replyText =
          `🎓 **Olinethra Open Internships (${openInternships.length}):**\n\n` +
          openInternships
            .map(
              (i) =>
                `• **${i.title}** (${i.workType}, ${i.duration})\n  Deadline: ${i.deadline}\n  Apply: ${i.applicationLink || `${env.CLIENT_URL}/careers`}`
            )
            .join("\n\n")
      } else {
        replyText = "All developer internship positions are currently Closed for this cohort."
      }
    } else {
      if (openJobs.length > 0) {
        replyText =
          `💼 **Olinethra Open Full-Time Roles (${openJobs.length}):**\n\n` +
          openJobs
            .map(
              (j) =>
                `• **${j.title}** (${j.employmentType}, ${j.workType})\n  Location: ${j.location}\n  Apply: ${j.applicationUrl || `${env.CLIENT_URL}/careers`}`
            )
            .join("\n\n")
      } else {
        replyText = "We do not have any open full-time positions at this moment."
      }
    }

    replyText += `\n\nVisit our Careers portal to review details: ${env.CLIENT_URL}/careers`

    return {
      reply: replyText,
      intent: lower.includes("intern") ? "INTERNSHIP" : "JOB",
    }
  }

  // 4. Portfolio & Projects (Option 3 or keyword)
  if (
    lower === "3" ||
    lower.includes("portfolio") ||
    lower.includes("project") ||
    lower.includes("work") ||
    lower.includes("case study")
  ) {
    const publishedProjects = projects.filter((p) => p.status === "Published").slice(0, 3)

    let replyText = `📁 **Featured Olinethra Projects:**\n\n`
    if (publishedProjects.length > 0) {
      replyText += publishedProjects
        .map((p) => `• **${p.title}** (${p.category}): ${p.description}`)
        .join("\n\n")
    } else {
      replyText += "We build custom web applications, e-commerce platforms, and SaaS products."
    }

    replyText += `\n\nExplore all projects: ${env.CLIENT_URL}/portfolio\nWould you like to discuss a new project for your company?`

    return {
      reply: replyText,
      intent: "PORTFOLIO",
    }
  }

  // 5. Services Inquiry (Option 2 or keyword)
  if (
    lower === "2" ||
    (lower.includes("service") && !lower.includes("project")) ||
    lower.includes("what do you do") ||
    lower.includes("what services")
  ) {
    const activeServices = services.filter((s) => s.status === "Active").slice(0, 4)

    let replyText = `⚡ **Olinethra Core Engineering Services:**\n\n`
    if (activeServices.length > 0) {
      replyText += activeServices
        .map((s) => `• **${s.title}**\n  ${s.shortDesc || "Custom web development."}`)
        .join("\n\n")
    } else {
      replyText += "• Web Application Development\n• E-Commerce Solutions\n• UI/UX Design & Frontend Engineering\n• Backend & API Development"
    }

    replyText += `\n\nLearn more: ${env.CLIENT_URL}/services\nIf you have a project in mind, tell me what you're planning to build!`

    return {
      reply: replyText,
      intent: "SERVICES",
    }
  }

  // 6. Commercial / Project Inquiry & Lead Capture (Option 1 or project intent detection)
  const isProjectIntent =
    lower === "1" ||
    lower.includes("website") ||
    lower.includes("app") ||
    lower.includes("build") ||
    lower.includes("develop") ||
    lower.includes("quote") ||
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("hire") ||
    lower.includes("e-commerce") ||
    lower.includes("ecommerce") ||
    lower.includes("saas") ||
    lower.includes("software")

  if (isProjectIntent) {
    // Find existing lead or create new lead
    let lead = conversation.leadId
      ? await Lead.findById(conversation.leadId)
      : await Lead.findOne({ whatsappUserId: conversation.whatsappUserId })

    if (!lead) {
      const legacyId = generateLegacyId("lead")
      lead = await Lead.create({
        legacyId,
        name: conversation.displayName || "WhatsApp Contact",
        phone: conversation.phone,
        source: "WHATSAPP",
        status: "QUALIFYING",
        priority: "MEDIUM",
        conversationId: conversation._id,
        whatsappUserId: conversation.whatsappUserId,
        notes: `Initial request: "${text}"`,
      })

      conversation.leadId = lead._id as unknown as typeof conversation.leadId
      conversation.status = "QUALIFYING"
      await conversation.save()

      await Notification.create({
        legacyId: generateLegacyId("notif"),
        type: "inquiry",
        title: "New WhatsApp Lead Discovered",
        message: `Lead from ${conversation.displayName} (${conversation.phone}): "${text.slice(0, 60)}"`,
        date: new Date().toISOString(),
        read: false,
        link: "/admin/whatsapp",
      })
    }

    // Infer attributes from user message
    let projectType = lead.projectType || "Web Application"
    if (lower.includes("e-commerce") || lower.includes("store") || lower.includes("shop")) {
      projectType = "E-Commerce Web Application"
    } else if (lower.includes("mobile") || lower.includes("app")) {
      projectType = "Web & Mobile App"
    } else if (lower.includes("landing") || lower.includes("website")) {
      projectType = "Corporate Website"
    }

    const detectedFeatures: string[] = Array.from(new Set(lead.features || []))
    if (lower.includes("payment") || lower.includes("stripe")) detectedFeatures.push("Online Payments")
    if (lower.includes("auth") || lower.includes("login")) detectedFeatures.push("User Authentication")
    if (lower.includes("admin") || lower.includes("dashboard")) detectedFeatures.push("Admin Dashboard")
    if (lower.includes("booking") || lower.includes("reservation")) detectedFeatures.push("Booking System")

    lead.projectType = projectType
    lead.features = detectedFeatures
    if (text.length > 20 && !lead.projectSummary) {
      lead.projectSummary = text
    }
    await lead.save()

    // Smart service recommendation based on projectType
    const matchedService = services.find((s) =>
      s.title.toLowerCase().includes(projectType.toLowerCase().split(" ")[0])
    ) || services[0]

    // Formulate progressive response asking only necessary details
    let responseText = ""
    if (!lead.projectSummary || lead.projectSummary.length < 15) {
      responseText = `Sure! I can help gather your project requirements for Olinethra.\n\nCould you describe what kind of product or website you are planning to build?\n\n• Company website\n• E-commerce store\n• Web application / SaaS\n• Admin portal / custom software`
    } else if (detectedFeatures.length === 0) {
      responseText = `Got it, a ${projectType}.\n\nRecommended Service: **${matchedService?.title || "Full-Stack Development"}**\n\nWhat key features do you need? (e.g., User Login, Payments, Admin Dashboard, Booking)`
    } else if (lead.timeline === "Not specified") {
      responseText = `Understood! Key features recorded: ${detectedFeatures.join(", ")}.\n\nWhat is your preferred target timeline for launch? (e.g., 1 month, 2-3 months, flexible)`
      lead.timeline = "Target timeline requested"
      await lead.save()
    } else {
      // Complete brief generation
      const brief = `📋 **OLINETHRA PROJECT BRIEF**\n\n` +
        `• **Project Type:** ${lead.projectType}\n` +
        `• **Summary:** ${lead.projectSummary}\n` +
        `• **Key Features:** ${lead.features.length > 0 ? lead.features.join(", ") : "Standard Features"}\n` +
        `• **Timeline:** ${lead.timeline}\n` +
        `• **Budget:** ${lead.budget}\n\n` +
        `I have prepared this brief for the Olinethra engineering team. Would you like to connect directly with our technical lead now? Reply **6** or **Talk to team** anytime.`

      conversation.summary = brief
      conversation.status = "QUALIFIED"
      await conversation.save()

      lead.status = "QUALIFIED"
      await lead.save()

      responseText = brief
    }

    return {
      reply: responseText,
      leadCreatedOrUpdated: true,
      intent: "PROJECT_INQUIRY",
    }
  }

  // 7. FAQ custom matching from CMS Chatbot Knowledge & FAQs
  const faqMatch = chatbotKnowledge.find(
    (k) =>
      lower.includes(k.question.toLowerCase()) ||
      k.question.toLowerCase().includes(lower)
  ) || faqs.find(
    (f) =>
      lower.includes(f.question.toLowerCase()) ||
      f.question.toLowerCase().includes(lower)
  )

  if (faqMatch) {
    return {
      reply: faqMatch.answer,
      intent: "FAQ",
    }
  }

  // 8. Unstructured queries with AI (Gemini) using Live CMS context & anti-hallucination rules
  if (env.GEMINI_API_KEY) {
    try {
      const liveKnowledgeSnapshot = {
        company: cms.siteSettings,
        services: services.filter((s) => s.status === "Active").map((s) => ({ title: s.title, desc: s.shortDesc })),
        projects: projects.filter((p) => p.status === "Published").map((p) => ({ title: p.title, category: p.category })),
        internships: internships.filter((i) => i.status === "Open").map((i) => ({ title: i.title, deadline: i.deadline })),
        jobs: jobs.filter((j) => j.status === "Open").map((j) => ({ title: j.title, location: j.location })),
        faqs: faqs.filter((f) => f.published).map((f) => ({ q: f.question, a: f.answer })),
      }


      const systemPrompt = `You are Olinethra's official WhatsApp AI assistant.
Rules:
- Be concise, friendly, and professional.
- Prioritize bullet points over long paragraphs.
- Rely ONLY on the official CMS knowledge snapshot below.
- NEVER invent pricing, guarantees, employees, clients, or fake open roles.
- If pricing or exact quote is requested and not in CMS, explain: "Project investment depends on scope and features. I can gather your project details for our engineering team."
- If confidence is low, suggest connecting with human team (reply 6).

CMS KNOWLEDGE:
${JSON.stringify(liveKnowledgeSnapshot, null, 2)}`

      const contents = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: text }] },
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
            reply: aiReply,
            intent: "AI_GENERATED",
          }
        }
      }
    } catch (err) {
      console.error("[WHATSAPP AGENT GEMINI ERROR]", err)
    }
  }

  // 9. Safe Fallback
  return {
    reply: "I'm not fully sure about that from the information I have. Would you like me to pass this conversation to the Olinethra team? Reply **6** or **Talk to team** to connect with a developer.",
    intent: "UNKNOWN",
  }
}
