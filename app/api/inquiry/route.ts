import { NextResponse } from "next/server"
import { getCmsData, saveCmsData, ProjectInquiryItem } from "@/lib/cms"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { name, email, company, projectType, budget, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 })
    }

    const cms = getCmsData()
    const isHighPriority =
      (budget && (budget.includes("15k") || budget.includes("30k") || budget.includes("40k") || budget.includes("50k"))) ||
      message.length > 300

    const newInquiry: ProjectInquiryItem = {
      id: `inq-${Date.now()}`,
      name,
      email,
      company: company || "N/A",
      projectType: projectType || "Web Application",
      budget: budget || "$5k - $15k",
      priority: isHighPriority ? "HIGH" : "MEDIUM",
      message,
      date: new Date().toISOString().split("T")[0],
      status: "New",
    }

    cms.inquiries.unshift(newInquiry)

    // Admin Notification Automation
    if (!cms.notifications) cms.notifications = []
    cms.notifications.unshift({
      id: `notif-${Date.now()}`,
      type: "inquiry",
      title: "New Project Inquiry Received",
      message: `${name} (${company || "Individual"}) submitted a ${projectType} inquiry.`,
      date: new Date().toISOString(),
      read: false,
      link: "/admin/inquiries",
    })

    // Activity Log Automation
    if (!cms.activityLog) cms.activityLog = []
    cms.activityLog.unshift({
      id: `act-${Date.now()}`,
      user: name,
      action: "Submitted Project Inquiry",
      entity: "Inquiry",
      date: new Date().toISOString(),
    })

    saveCmsData(cms)

    // Confirmation Email Automation (Fire and forget, graceful handling)
    sendEmail({
      to: email,
      subject: "We've received your project inquiry — Olinethra",
      body: `Hi ${name},\n\nThank you for reaching out to Olinethra.\n\nWe have received your ${projectType} project details (${budget || "Custom Budget"}). Our lead software engineer will review your scope and get back to you within 1 business day.\n\nBest regards,\nThe Olinethra Engineering Team\nhttps://olinethra.com`,
      templateName: "inquiry_confirmation",
    }).catch(console.error)

    return NextResponse.json({ success: true, inquiry: newInquiry })
  } catch (error) {
    console.error("Inquiry API error:", error)
    return NextResponse.json({ error: "Failed to submit project inquiry." }, { status: 500 })
  }
}
