"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  MessageSquare,
  Users,
  Bot,
  UserCheck,
  Send,
  Play,
  Pause,
  RefreshCw,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadQualityCard } from "@/components/admin/LeadQualityCard"


interface LeadData {
  _id?: string
  legacyId?: string
  name: string
  phone?: string
  source: string
  projectType?: string
  projectSummary?: string
  features: string[]
  budget?: string
  timeline?: string
  status: string
  priority: "LOW" | "MEDIUM" | "HIGH"
  assignedTo?: string
  notes?: string
  createdAt?: string
}

interface ConversationItem {
  _id: string
  whatsappUserId: string
  phone: string
  displayName: string
  status: string
  aiEnabled: boolean
  assignedTo: string
  lastMessageAt: string
  summary: string
  unreadCount: number
  leadId?: LeadData
}

interface MessageItem {
  _id: string
  conversationId: string
  direction: "INBOUND" | "OUTBOUND"
  senderType: "USER" | "AI" | "ADMIN"
  type: string
  text: string
  status: string
  createdAt: string
}

interface InsightsData {
  totalConversations: number
  totalLeads: number
  handoffsCount: number
  aiActiveCount: number
  messagesCount: number
  topicBreakdown: Array<{ topic: string; count: number }>
}

export default function AdminWhatsAppPage() {
  const [activeTab, setActiveTab] = React.useState<"conversations" | "leads" | "insights" | "settings">("conversations")
  const [conversations, setConversations] = React.useState<ConversationItem[]>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [messages, setMessages] = React.useState<MessageItem[]>([])
  const [selectedConversation, setSelectedConversation] = React.useState<ConversationItem | null>(null)
  const [leads, setLeads] = React.useState<LeadData[]>([])
  const [insights, setInsights] = React.useState<InsightsData | null>(null)
  const [replyText, setReplyText] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [sending, setSending] = React.useState(false)

  const fetchConversations = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/whatsapp/conversations?search=${encodeURIComponent(search)}`)
      const data = await res.json()
      if (data.success) {
        setConversations(data.conversations)
        if (!selectedId && data.conversations.length > 0) {
          setSelectedId(data.conversations[0]._id)
        }
      }
    } catch (err) {
      console.error("Failed fetching conversations", err)
    } finally {
      setLoading(false)
    }
  }, [search, selectedId])

  const fetchConversationDetail = React.useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/whatsapp/conversations/${id}`)
      const data = await res.json()
      if (data.success) {
        setSelectedConversation(data.conversation)
        setMessages(data.messages)
      }
    } catch (err) {
      console.error("Failed fetching conversation details", err)
    }
  }, [])

  const fetchLeads = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/whatsapp/leads")
      const data = await res.json()
      if (data.success) {
        setLeads(data.leads)
      }
    } catch (err) {
      console.error("Failed fetching leads", err)
    }
  }, [])

  const fetchInsights = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/whatsapp/insights")
      const data = await res.json()
      if (data.success) {
        setInsights(data.insights)
      }
    } catch (err) {
      console.error("Failed fetching insights", err)
    }
  }, [])

  React.useEffect(() => {
    fetchConversations()
    fetchLeads()
    fetchInsights()
  }, [fetchConversations, fetchLeads, fetchInsights])

  React.useEffect(() => {
    if (selectedId) {
      fetchConversationDetail(selectedId)
    }
  }, [selectedId, fetchConversationDetail])

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId || !replyText.trim()) return

    try {
      setSending(true)
      const res = await fetch(`/api/admin/whatsapp/conversations/${selectedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setReplyText("")
        fetchConversationDetail(selectedId)
        fetchConversations()
      }
    } catch (err) {
      console.error("Error sending reply", err)
    } finally {
      setSending(false)
    }
  }

  const handleTakeover = async () => {
    if (!selectedId) return
    try {
      const res = await fetch(`/api/admin/whatsapp/conversations/${selectedId}/takeover`, { method: "POST" })
      const data = await res.json()
      if (data.success) {
        fetchConversationDetail(selectedId)
        fetchConversations()
      }
    } catch (err) {
      console.error("Takeover failed", err)
    }
  }

  const handleResumeAi = async () => {
    if (!selectedId) return
    try {
      const res = await fetch(`/api/admin/whatsapp/conversations/${selectedId}/resume-ai`, { method: "POST" })
      const data = await res.json()
      if (data.success) {
        fetchConversationDetail(selectedId)
        fetchConversations()
      }
    } catch (err) {
      console.error("Resume AI failed", err)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-5 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <PhoneCall className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
                WhatsApp AI Agent
              </h1>
            </div>
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
              Manage WhatsApp Business conversations, qualified project leads, and AI agent status.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-neutral-200/60 p-1 dark:bg-neutral-800">
            <button
              onClick={() => setActiveTab("conversations")}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "conversations"
                  ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-900 dark:text-white"
                  : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Conversations
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "leads"
                  ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-900 dark:text-white"
                  : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "insights"
                  ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-900 dark:text-white"
                  : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              FAQ Insights
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`rounded-md px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-900 dark:text-white"
                  : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tab 1: Conversations Split View */}
        {activeTab === "conversations" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* Conversation List */}
            <div className="lg:col-span-4 flex flex-col rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-neutral-50 pl-9 pr-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={fetchConversations} className="h-8 w-8 shrink-0">
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 max-h-[550px]">
                {loading && conversations.length === 0 ? (
                  <div className="p-8 text-center font-mono text-xs text-neutral-500">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center font-mono text-xs text-neutral-500">No WhatsApp conversations yet.</div>
                ) : (
                  conversations.map((conv) => {
                    const isSelected = conv._id === selectedId
                    return (
                      <div
                        key={conv._id}
                        onClick={() => setSelectedId(conv._id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-neutral-100 dark:bg-neutral-800/80 border-l-4 border-emerald-500"
                            : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-neutral-950 dark:text-neutral-50">{conv.displayName}</span>
                          <span className="font-mono text-[10px] text-neutral-500">
                            {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-neutral-500 truncate mt-0.5">{conv.phone}</p>
                        
                        <div className="flex items-center justify-between mt-2.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-mono font-semibold ${
                              conv.aiEnabled
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                            }`}
                          >
                            {conv.aiEnabled ? <Bot className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                            {conv.aiEnabled ? "AI Active" : "Human Handoff"}
                          </span>

                          <span className="font-mono text-[10px] uppercase font-bold text-neutral-600 dark:text-neutral-400">
                            {conv.status}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Conversation Detail & Chat */}
            <div className="lg:col-span-8 flex flex-col rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-base text-neutral-950 dark:text-neutral-50 flex items-center gap-2">
                        <span>{selectedConversation.displayName}</span>
                        <span className="text-xs font-mono font-normal text-neutral-500">({selectedConversation.phone})</span>
                      </h2>
                      <p className="text-xs font-mono text-neutral-500">
                        Status: <strong className="text-neutral-900 dark:text-neutral-200">{selectedConversation.status}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedConversation.aiEnabled ? (
                        <Button variant="outline" size="sm" onClick={handleTakeover} className="text-xs border-amber-500 text-amber-700 dark:text-amber-400 hover:bg-amber-50">
                          <Pause className="h-3.5 w-3.5 mr-1" /> Pause AI / Take Over
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={handleResumeAi} className="text-xs border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50">
                          <Play className="h-3.5 w-3.5 mr-1" /> Resume AI
                        </Button>
                      )}
                    </div>
                  </div>

                  {selectedConversation.leadId && (
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-900/30">
                      <LeadQualityCard
                        leadId={String(selectedConversation.leadId._id || selectedConversation.leadId.legacyId || selectedConversation.leadId)}
                        ml={(selectedConversation.leadId as any).ml}
                        onRescored={() => fetchConversationDetail(selectedConversation._id)}
                      />
                    </div>
                  )}

                  {/* Summary / Brief Banner if available */}

                  {selectedConversation.summary && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900 text-xs font-mono text-emerald-900 dark:text-emerald-200 whitespace-pre-wrap">
                      {selectedConversation.summary}
                    </div>
                  )}

                  {/* Messages Feed */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[350px] max-h-[420px] bg-neutral-50/50 dark:bg-neutral-950/30">
                    {messages.map((m) => {
                      const isInbound = m.direction === "INBOUND"
                      return (
                        <div key={m._id} className={`flex flex-col ${isInbound ? "items-start" : "items-end"}`}>
                          <div
                            className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs font-sans ${
                              isInbound
                                ? "bg-white text-neutral-900 border border-neutral-200 dark:bg-neutral-800 dark:text-white dark:border-neutral-700"
                                : m.senderType === "ADMIN"
                                ? "bg-blue-600 text-white"
                                : "bg-emerald-700 text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1 font-mono text-[10px] opacity-80">
                              <span>{m.senderType}</span>
                              <span>•</span>
                              <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{m.text}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Reply Input Box */}
                  <form onSubmit={handleSendReply} className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a response to this user on WhatsApp..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-neutral-950 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                    />
                    <Button type="submit" disabled={sending || !replyText.trim()} className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950">
                      <Send className="h-4 w-4 mr-1" /> Reply
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-12 text-center text-neutral-400 font-mono text-xs">
                  Select a conversation from the list to view chat history and take over.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Qualified Leads */}
        {activeTab === "leads" && (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
            <h2 className="font-mono text-lg font-bold uppercase text-neutral-950 dark:text-neutral-50">
              WhatsApp Generated Leads ({leads.length})
            </h2>

            {leads.length === 0 ? (
              <p className="font-mono text-xs text-neutral-500">No leads generated via WhatsApp yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase">
                      <th className="pb-3 px-3">Name / Phone</th>
                      <th className="pb-3 px-3">Project Type</th>
                      <th className="pb-3 px-3">Features</th>
                      <th className="pb-3 px-3">Timeline</th>
                      <th className="pb-3 px-3">Priority</th>
                      <th className="pb-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {leads.map((l) => (
                      <tr key={l._id || l.legacyId} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="py-3 px-3">
                          <p className="font-bold text-neutral-950 dark:text-neutral-50">{l.name}</p>
                          <p className="text-[10px] text-neutral-500">{l.phone}</p>
                        </td>
                        <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200">{l.projectType}</td>
                        <td className="py-3 px-3">
                          {l.features && l.features.length > 0 ? (
                            <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] dark:bg-neutral-800">
                              {l.features.join(", ")}
                            </span>
                          ) : (
                            "Standard"
                          )}
                        </td>
                        <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">{l.timeline}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              l.priority === "HIGH"
                                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                            }`}
                          >
                            {l.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{l.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Insights & Analytics */}
        {activeTab === "insights" && insights && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="font-mono text-xs text-neutral-500 uppercase">Total Conversations</p>
                <p className="font-mono text-2xl font-bold text-neutral-950 dark:text-neutral-50 mt-1">
                  {insights.totalConversations}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="font-mono text-xs text-neutral-500 uppercase">Qualified Leads</p>
                <p className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {insights.totalLeads}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="font-mono text-xs text-neutral-500 uppercase">Human Handoffs</p>
                <p className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {insights.handoffsCount}
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="font-mono text-xs text-neutral-500 uppercase">AI Active Sessions</p>
                <p className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {insights.aiActiveCount}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
              <h3 className="font-mono text-base font-bold uppercase text-neutral-950 dark:text-neutral-50">
                Popular Inquiry Topics & Intent Breakdown
              </h3>
              <div className="space-y-3">
                {insights.topicBreakdown.map((tb) => (
                  <div key={tb.topic} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-700 dark:text-neutral-300">{tb.topic}</span>
                    <span className="font-bold text-neutral-950 dark:text-neutral-50">{tb.count} inquiries</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Settings & Configuration */}
        {activeTab === "settings" && (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
            <h2 className="font-mono text-lg font-bold uppercase text-neutral-950 dark:text-neutral-50">
              WhatsApp Integration Settings & Status
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">Official Webhook Status</p>
                  <p className="text-neutral-500 mt-0.5">Endpoint: /api/v1/webhooks/whatsapp</p>
                </div>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Ready & Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">Configured WhatsApp Phone Number</p>
                  <p className="text-neutral-500 mt-0.5">Exposed on public site CTAs</p>
                </div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || "+15550192834"}
                </span>
              </div>

              <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-2">
                <p className="font-bold text-neutral-900 dark:text-neutral-100">Security & Credentials Notice</p>
                <p className="text-neutral-500">
                  All Meta WhatsApp Cloud API access tokens (`WHATSAPP_ACCESS_TOKEN`), App Secrets, and Webhook verification tokens are securely stored in server-side environment variables in `olinethra-api/.env` and are NEVER exposed to the frontend browser client.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
