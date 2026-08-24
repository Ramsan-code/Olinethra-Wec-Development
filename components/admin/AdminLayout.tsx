"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Layers,
  HelpCircle,
  Bot,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Code2,
  ShieldCheck,
  PhoneCall,
  Brain,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface AdminUser {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Content Admin" | "Hiring Admin"
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/whatsapp", label: "WhatsApp Agent", icon: PhoneCall },
  { href: "/admin/projects", label: "Portfolio / Work", icon: FolderGit2 },
  { href: "/admin/team", label: "Team Members", icon: Users },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/internships", label: "Internships", icon: GraduationCap },
  { href: "/admin/hiring", label: "Hiring / Jobs", icon: Briefcase },
  { href: "/admin/faqs", label: "FAQ Manager", icon: HelpCircle },
  { href: "/admin/chatbot", label: "Chatbot Knowledge", icon: Bot },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/inquiries", label: "Project Inquiries", icon: MessageSquare },
  { href: "/admin/quotes", label: "Quotation Archive", icon: FileText },
  { href: "/admin/analytics/ml", label: "Lead Intelligence ML", icon: Brain },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
]




export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [admin, setAdmin] = React.useState<AdminUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login")
          return null
        }
        return res.json()
      })
      .then((body) => {
        if (!body) return
        setAdmin(body.data.user)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="flex items-center gap-3">
          <Code2 className="h-6 w-6 animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest">Loading Olinethra Admin...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-6 dark:border-neutral-800">
          <Link href="/admin" className="flex items-center gap-2 font-mono text-sm font-black tracking-wider">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
              &lt;/&gt;
            </div>
            <span>OLINETHRA CMS</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-mono transition-colors ${
                  isActive
                    ? "bg-neutral-950 font-bold text-white dark:bg-neutral-100 dark:text-neutral-950"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-neutral-950 dark:text-neutral-50">{admin?.name}</p>
              <span className="inline-block font-mono text-[10px] text-neutral-500 uppercase">{admin?.role}</span>
            </div>
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full text-xs border-neutral-300 dark:border-neutral-700"
            >
              <Link href="/" target="_blank" className="flex items-center justify-center gap-1.5">
                <span>View Site</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Sign Out"
              className="h-8 w-8 shrink-0 text-neutral-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Sheet Drawer */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80vw] max-w-[280px] p-0">
                  <SheetHeader className="border-b border-neutral-200 p-4 dark:border-neutral-800">
                    <SheetTitle className="flex items-center gap-2 font-mono text-sm font-black">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
                        &lt;/&gt;
                      </div>
                      <span>OLINETHRA CMS</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-mono ${
                            isActive
                              ? "bg-neutral-950 font-bold text-white dark:bg-neutral-100 dark:text-neutral-950"
                              : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <h1 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
              Admin Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block rounded border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-xs font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
              {admin?.role}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-neutral-300 dark:border-neutral-700"
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
