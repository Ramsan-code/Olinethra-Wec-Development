import { NextResponse } from "next/server"
import { getCmsData, saveCmsData } from "@/lib/cms"
import { getCurrentAdmin } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export async function GET() {
  const cms = getCmsData()
  return NextResponse.json(cms)
}

export async function POST(req: Request) {
  try {
    const admin = await getCurrentAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 })
    }

    const { action, entity, data } = await req.json()
    const currentCms = getCmsData()

    if (!currentCms.activityLog) currentCms.activityLog = []
    if (!currentCms.notifications) currentCms.notifications = []

    if (action === "updateSettings") {
      currentCms.siteSettings = { ...currentCms.siteSettings, ...data }
      currentCms.activityLog.unshift({
        id: `act-${Date.now()}`,
        user: admin.name || "Admin",
        action: "Updated Global Site Settings",
        entity: "Settings",
        date: new Date().toISOString(),
      })
      saveCmsData(currentCms)
      return NextResponse.json({ success: true, data: currentCms.siteSettings })
    }

    if (entity && Array.isArray((currentCms as any)[entity])) {
      if (action === "create") {
        const newItem = { id: `${entity}-${Date.now()}`, ...data }
        ;(currentCms as any)[entity].unshift(newItem)

        currentCms.activityLog.unshift({
          id: `act-${Date.now()}`,
          user: admin.name || "Admin",
          action: `Created new item in ${entity}`,
          entity: entity,
          date: new Date().toISOString(),
        })

        saveCmsData(currentCms)
        return NextResponse.json({ success: true, item: newItem })
      }

      if (action === "update") {
        const index = (currentCms as any)[entity].findIndex((i: any) => i.id === data.id)
        if (index !== -1) {
          const prevItem: any = (currentCms as any)[entity][index]
          const updatedItem = { ...prevItem, ...data }
          ;(currentCms as any)[entity][index] = updatedItem

          // Special Automation: Candidate Application Status Email Trigger
          if (entity === "applications" && prevItem.status !== data.status) {
            const applicantEmail = data.email
            const applicantName = data.applicantName
            const roleTitle = data.opportunityTitle

            let emailBody = ""
            let subject = `Application Update: ${roleTitle} — Olinethra`

            if (data.status === "Shortlisted") {
              emailBody = `Hi ${applicantName},\n\nGreat news! Your application for "${roleTitle}" at Olinethra has been shortlisted by our engineering leads.\n\nWe will reach out shortly with details regarding next steps.\n\nBest regards,\nOlinethra Talent Team`
            } else if (data.status === "Accepted") {
              emailBody = `Hi ${applicantName},\n\nCongratulations! We are pleased to extend an offer for the "${roleTitle}" position at Olinethra.\n\nOur team will send onboarding documentation shortly.\n\nBest regards,\nOlinethra Engineering`
            } else if (data.status === "Rejected") {
              emailBody = `Hi ${applicantName},\n\nThank you for taking the time to apply for "${roleTitle}" at Olinethra. While we were impressed by your profile, we have decided to move forward with other candidates at this time.\n\nWe appreciate your interest in Olinethra.\n\nBest regards,\nOlinethra Team`
            }

            if (emailBody && applicantEmail) {
              sendEmail({
                to: applicantEmail,
                subject,
                body: emailBody,
                templateName: "status_update",
              }).catch(console.error)
            }
          }

          currentCms.activityLog.unshift({
            id: `act-${Date.now()}`,
            user: admin.name || "Admin",
            action: `Updated item in ${entity} (${data.id})`,
            entity: entity,
            date: new Date().toISOString(),
          })

          saveCmsData(currentCms)
          return NextResponse.json({ success: true, item: (currentCms as any)[entity][index] })
        }
      }

      if (action === "delete") {
        ;(currentCms as any)[entity] = (currentCms as any)[entity].filter((i: any) => i.id !== data.id)

        currentCms.activityLog.unshift({
          id: `act-${Date.now()}`,
          user: admin.name || "Admin",
          action: `Deleted item from ${entity}`,
          entity: entity,
          date: new Date().toISOString(),
        })

        saveCmsData(currentCms)
        return NextResponse.json({ success: true })
      }
    }

    return NextResponse.json({ error: "Invalid action or entity." }, { status: 400 })
  } catch (error) {
    console.error("CMS API error:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
