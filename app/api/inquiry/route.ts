import { NextResponse } from "next/server"
import { getCmsData, saveCmsData, ProjectInquiryItem } from "@/lib/cms"

export async function POST(req: Request) {
  try {
    const { name, email, company, projectType, budget, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 })
    }

    const cms = getCmsData()
    const newInquiry: ProjectInquiryItem = {
      id: `inq-${Date.now()}`,
      name,
      email,
      company: company || "N/A",
      projectType: projectType || "Web Application",
      budget: budget || "Custom Quote",
      message,
      date: new Date().toISOString().split("T")[0],
      status: "New",
    }

    cms.inquiries.unshift(newInquiry)
    saveCmsData(cms)

    return NextResponse.json({ success: true, inquiry: newInquiry })
  } catch (error) {
    console.error("Inquiry API error:", error)
    return NextResponse.json({ error: "Failed to submit project inquiry." }, { status: 500 })
  }
}
