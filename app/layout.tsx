import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "Olinethra — Web Development & Digital Solutions",
    template: "%s | Olinethra",
  },
  description:
    "Olinethra builds modern websites, web applications, and digital solutions that help businesses grow. Full-stack development agency specializing in Next.js, React, and TypeScript.",
  keywords: [
    "Olinethra",
    "Web Development Agency",
    "Full-Stack Development",
    "Next.js Developers",
    "React Web Applications",
    "UI UX Design Studio",
    "TypeScript Engineering",
    "Software Agency",
  ],
  authors: [{ name: "Olinethra Engineering Team" }],
  creator: "Olinethra",
  publisher: "Olinethra",
  metadataBase: new URL("https://olinethra.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Olinethra — Web Development & Digital Solutions",
    description:
      "Olinethra builds modern websites, web applications, and digital solutions that help businesses grow.",
    url: "https://olinethra.com",
    siteName: "Olinethra",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olinethra — Web Development & Digital Solutions",
    description:
      "Olinethra builds modern websites, web applications, and digital solutions that help businesses grow.",
    creator: "@olinethra",
  },
  robots: {
    index: true,
    follow: true,
  },
}

import Chatbot from "@/components/chat/Chatbot"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
        {children}
        <Chatbot />
      </body>
    </html>
  )
}
