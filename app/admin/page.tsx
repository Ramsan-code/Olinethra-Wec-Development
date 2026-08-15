"use client"

import * as React from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  Users,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Layers,
  HelpCircle,
  Bot,
  MessageSquare,
  FileText,
  ArrowUpRight,
  Plus,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CmsStore } from "@/lib/cms"

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<CmsStore | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Dashboard error:", err)
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return (
      <AdminLayout>
        <div className="py-12 text-center font-mono text-xs text-neutral-500 uppercase">
          Loading Dashboard Stats...
        </div>
      </AdminLayout>
    )
  }

  const activeInternshipsCount = data.internships.filter((i) => i.status === "Open").length
  const openJobsCount = data.jobs.filter((j) => j.status === "Open").length
  const publishedProjectsCount = data.projects.filter((p) => p.status === "Published").length
  const activeServicesCount = data.services.filter((s) => s.status === "Active").length
  const activeTeamCount = data.team.filter((t) => t.status === "Active").length
  const newApplicationsCount = data.applications.filter((a) => a.status === "New").length
  const newInquiriesCount = data.inquiries.filter((i) => i.status === "New").length

  const stats = [
    { label: "Team Members", value: activeTeamCount, total: data.team.length, icon: Users, href: "/admin/team" },
    { label: "Active Internships", value: activeInternshipsCount, total: data.internships.length, icon: GraduationCap, href: "/admin/internships" },
    { label: "Open Hiring Positions", value: openJobsCount, total: data.jobs.length, icon: Briefcase, href: "/admin/hiring" },
    { label: "Published Projects", value: publishedProjectsCount, total: data.projects.length, icon: FolderGit2, href: "/admin/projects" },
    { label: "Active Services", value: activeServicesCount, total: data.services.length, icon: Layers, href: "/admin/services" },
    { label: "FAQ Entries", value: data.faqs.length, total: data.faqs.length, icon: HelpCircle, href: "/admin/faqs" },
    { label: "Chatbot QA Items", value: data.chatbotKnowledge.length, total: data.chatbotKnowledge.length, icon: Bot, href: "/admin/chatbot" },
    { label: "Project Inquiries", value: newInquiriesCount, total: data.inquiries.length, icon: MessageSquare, href: "/admin/inquiries" },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500">
              [ SYSTEM OVERVIEW ]
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-50">
              Dashboard Overview
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
              <Link href="/admin/internships">
                <Plus className="h-4 w-4 mr-1" />
                Add Internship
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-neutral-300 dark:border-neutral-700">
              <Link href="/admin/projects">
                <Plus className="h-4 w-4 mr-1" />
                Add Project
              </Link>
            </Button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group relative rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="mt-4">
                  <div className="font-mono text-2xl font-black text-neutral-950 dark:text-neutral-50">
                    {stat.value}
                    <span className="text-xs text-neutral-400 font-normal ml-1">/ {stat.total}</span>
                  </div>
                  <p className="mt-1 text-xs font-mono text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Dashboard 2-Column Activity & Inquiries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Inquiries (7 columns) */}
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <h2 className="font-mono text-xs uppercase font-bold text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Recent Contact & Project Inquiries</span>
              </h2>
              <Link href="/admin/inquiries" className="text-xs font-mono text-neutral-500 hover:underline">
                View All ({data.inquiries.length}) →
              </Link>
            </div>

            <div className="space-y-3">
              {data.inquiries.slice(0, 4).map((inq) => (
                <div
                  key={inq.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-neutral-950 dark:text-neutral-50">{inq.name}</span>
                      <span className="text-[10px] font-mono text-neutral-400">({inq.company})</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">{inq.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase ${
                        inq.status === "New"
                          ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold"
                          : "border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">{inq.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity & System Status (5 columns) */}
          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <h2 className="font-mono text-xs uppercase font-bold text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>System & AI Chatbot Status</span>
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-neutral-600 dark:text-neutral-400">AI Chatbot Knowledge Engine</span>
                <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active & Synced
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-neutral-600 dark:text-neutral-400">Pending Applications</span>
                <span className="font-bold text-neutral-950 dark:text-neutral-50">{newApplicationsCount} New</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
                <span className="text-neutral-600 dark:text-neutral-400">Open Career Positions</span>
                <span className="font-bold text-neutral-950 dark:text-neutral-50">
                  {activeInternshipsCount + openJobsCount} Total
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild variant="outline" className="w-full text-xs border-neutral-300 dark:border-neutral-700">
                <Link href="/admin/chatbot" className="flex items-center justify-center gap-1.5">
                  <Bot className="h-4 w-4" />
                  <span>Manage Chatbot Knowledge →</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
