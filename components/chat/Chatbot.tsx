"use client"

import * as React from "react"
import Link from "next/link"
import {
  MessageSquare,
  X,
  Send,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  suggestedAction?: {
    text: string
    href: string
  }
}

const faqSuggestions = [
  "What services does Olinethra provide?",
  "How much does a website cost?",
  "What technologies do you use?",
  "How does your development process work?",
  "How long does a project take?",
  "Can you build custom web applications?",
  "How can I start a project?",
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [isOpen, messages, isLoading, scrollToBottom])

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response || "Thank you for reaching out!",
          suggestedAction: data.suggestedAction,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "We encountered an issue processing your request. Please email our engineering team at hello@olinethra.com or try again.",
            suggestedAction: {
              text: "Let's discuss your project →",
              href: "/contact",
            },
          },
        ])
      }
    } catch (err) {
      console.error("Chat error:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Connection interrupted. Please reach out to our team at hello@olinethra.com.",
          suggestedAction: {
            text: "Let's discuss your project →",
            href: "/contact",
          },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <aside aria-label="AI Chat Assistant" className="z-50">
      {/* Floating Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2">
        {!isOpen && (
          <div className="hidden md:flex items-center gap-2 rounded-full border border-neutral-200 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-75 dark:bg-white"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-950 dark:bg-white"></span>
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              AI Assistant
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Chatbot" : "Open Olinethra AI Assistant"}
          aria-expanded={isOpen}
          className="group flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-neutral-950 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:ring-white"
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:rotate-90" />
          ) : (
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200 group-hover:scale-110" />
          )}
        </button>
      </div>

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Olinethra AI Chat Window"
          className="fixed bottom-20 right-4 sm:right-6 z-50 flex w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] h-[520px] max-h-[78vh] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-950"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-950 dark:text-neutral-50">
                  Olinethra AI Assistant
                </h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                    Online • Knowledge Base Connected
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear Conversation"
                  aria-label="Clear Conversation"
                  className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
                className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages & FAQ Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {/* Default Greeting & Suggestion Chips */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-xs border border-neutral-200 bg-neutral-50 p-3.5 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 space-y-1.5">
                  <p className="font-semibold text-xs text-neutral-950 dark:text-neutral-50">
                    Hi! 👋 How can we help?
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Ask me anything about Olinethra&apos;s software development services, engineering stack, pricing, process, or projects.
                  </p>
                </div>
              </div>

              {/* Quick FAQ Pills */}
              {messages.length === 0 && (
                <div className="pt-2 space-y-2">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 pl-1">
                    [ SUGGESTED QUESTIONS ]
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {faqSuggestions.map((faq) => (
                      <button
                        key={faq}
                        type="button"
                        onClick={() => handleSend(faq)}
                        className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-left text-xs font-medium text-neutral-800 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-950"
                      >
                        {faq}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Conversation History */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "rounded-tr-xs bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950"
                      : "rounded-tl-xs border border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Suggested Action CTA Link */}
                {msg.suggestedAction && (
                  <div className="mt-2 pl-1">
                    <Button
                      asChild
                      size="sm"
                      className="h-8 text-xs bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-200"
                    >
                      <Link
                        href={msg.suggestedAction.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-1.5 font-medium"
                      >
                        <span>{msg.suggestedAction.text}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 pl-1 text-xs text-neutral-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
                  <Bot className="h-3.5 w-3.5 text-neutral-500" />
                </div>
                <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about services, pricing, stack..."
                rows={1}
                className="flex-1 max-h-24 min-h-[38px] resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-950 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder-neutral-500 dark:focus:border-neutral-100"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-950"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-1.5 text-center font-mono text-[9px] text-neutral-400 dark:text-neutral-500">
              Olinethra Engineering Assistant • Press Enter to send
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
