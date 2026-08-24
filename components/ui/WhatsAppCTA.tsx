"use client"

import * as React from "react"
import { PhoneCall, MessageCircle, X, ExternalLink } from "lucide-react"

interface WhatsAppCTAProps {
  phoneNumber?: string
  defaultMessage?: string
  className?: string
  variant?: "floating" | "inline" | "button"
  label?: string
}

export function WhatsAppCTA({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || "+15550192834",
  defaultMessage = "Hi Olinethra, I'd like to discuss a software project for my company.",
  className = "",
  variant = "floating",
  label = "Chat on WhatsApp",
}: WhatsAppCTAProps) {
  const [open, setOpen] = React.useState(false)

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "")
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`

  if (variant === "button") {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-mono text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg dark:bg-emerald-600 dark:hover:bg-emerald-500 ${className}`}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{label}</span>
      </a>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 dark:border-emerald-500/30 dark:bg-emerald-950/20 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-neutral-900 dark:text-white">Discuss your project on WhatsApp</p>
              <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">Get instant answers from our AI agent or engineering team.</p>
            </div>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-emerald-700"
          >
            <span>Start Chat</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    )
  }

  // Floating Bottom-Left Widget
  return (
    <div className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 ${className}`}>
      {open && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <p className="font-mono text-xs font-bold text-neutral-950 dark:text-neutral-50">Olinethra WhatsApp AI</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="py-3 space-y-2">
            <p className="text-xs font-sans text-neutral-600 dark:text-neutral-300">
              Hi 👋 Need a fast quote or tech details? Connect with Olinethra directly on WhatsApp.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 font-mono text-xs font-bold text-white transition-all hover:bg-emerald-700 shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Open WhatsApp Conversation</span>
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-emerald-500 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-400"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  )
}
