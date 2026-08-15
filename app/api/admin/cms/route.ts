import { NextResponse } from "next/server"
import { getCmsData, saveCmsData, CmsStore } from "@/lib/cms"
import { getCurrentAdmin } from "@/lib/auth"

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

    if (action === "updateSettings") {
      currentCms.siteSettings = { ...currentCms.siteSettings, ...data }
      saveCmsData(currentCms)
      return NextResponse.json({ success: true, data: currentCms.siteSettings })
    }

    if (entity && Array.isArray((currentCms as any)[entity])) {
      if (action === "create") {
        const newItem = { id: `${entity}-${Date.now()}`, ...data }
        ;(currentCms as any)[entity].unshift(newItem)
        saveCmsData(currentCms)
        return NextResponse.json({ success: true, item: newItem })
      }

      if (action === "update") {
        const index = (currentCms as any)[entity].findIndex((i: any) => i.id === data.id)
        if (index !== -1) {
          ;(currentCms as any)[entity][index] = { ...(currentCms as any)[entity][index], ...data }
          saveCmsData(currentCms)
          return NextResponse.json({ success: true, item: (currentCms as any)[entity][index] })
        }
      }

      if (action === "delete") {
        ;(currentCms as any)[entity] = (currentCms as any)[entity].filter((i: any) => i.id !== data.id)
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
