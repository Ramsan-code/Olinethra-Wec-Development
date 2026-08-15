"use client"

import * as React from "react"
import Link from "next/link"
import { Code2, Mail } from "lucide-react"
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/ui/icons"
import { SiteSettings, CmsStore } from "@/lib/cms"

export default function Footer() {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null)

  React.useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        if (data?.siteSettings) setSettings(data.siteSettings)
      })
      .catch(() => {})
  }, [])

  const socialLinks = React.useMemo(() => {
    const list = []
    if (settings?.linkedinUrl?.trim()) {
      list.push({ name: "LinkedIn", href: settings.linkedinUrl, icon: LinkedinIcon })
    }
    if (settings?.githubUrl?.trim()) {
      list.push({ name: "GitHub", href: settings.githubUrl, icon: GithubIcon })
    }
    if (settings?.twitterUrl?.trim()) {
      list.push({ name: "X / Twitter", href: settings.twitterUrl, icon: TwitterIcon })
    }
    if (settings?.facebookUrl?.trim()) {
      list.push({ name: "Facebook", href: settings.facebookUrl, icon: FacebookIcon })
    }
    if (settings?.instagramUrl?.trim()) {
      list.push({ name: "Instagram", href: settings.instagramUrl, icon: InstagramIcon })
    }
    if (settings?.youtubeUrl?.trim()) {
      list.push({ name: "YouTube", href: settings.youtubeUrl, icon: YoutubeIcon })
    }
    // Fallback if settings not yet loaded
    if (list.length === 0) {
      return [
        { name: "LinkedIn", href: "https://linkedin.com/company/olinethra", icon: LinkedinIcon },
        { name: "GitHub", href: "https://github.com/olinethra", icon: GithubIcon },
        { name: "X / Twitter", href: "https://twitter.com/olinethra", icon: TwitterIcon },
      ]
    }
    return list
  }, [settings])

  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-950 text-neutral-100 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
          {/* Brand Info (2 columns) */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-neutral-950 font-mono text-xs">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="font-mono tracking-wider text-base uppercase text-white">OLINETHRA</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-neutral-400">
              {settings?.footerTagline ||
                "Olinethra is a full-stack web development agency and software studio. We design, architect, and build modern digital experiences, web applications, and enterprise software solutions."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {socialLinks.map((item) => {
                const IconComponent = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 transition-all duration-200 hover:border-neutral-400 hover:text-white hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    aria-label={`Follow Olinethra on ${item.name}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                )
              })}

              <a
                href={`mailto:${settings?.contactEmail || "hello@olinethra.com"}`}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 transition-all duration-200 hover:border-neutral-400 hover:text-white hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                aria-label="Email Olinethra"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400">Navigation</h3>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition-colors hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="transition-colors hover:text-white">
                  Projects &amp; Work
                </Link>
              </li>
              <li>
                <Link href="/team" className="transition-colors hover:text-white">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                  Careers &amp; Internships
                  <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300 uppercase">
                    Hiring
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services Column */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400">Services</h3>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li>
                <Link href="/services#web-development" className="transition-colors hover:text-white">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services#ui-ux-design" className="transition-colors hover:text-white">
                  UI/UX Design Systems
                </Link>
              </li>
              <li>
                <Link href="/services#ecommerce-solutions" className="transition-colors hover:text-white">
                  E-Commerce Platforms
                </Link>
              </li>
              <li>
                <Link href="/services#cloud-saas-architecture" className="transition-colors hover:text-white">
                  SaaS Architecture
                </Link>
              </li>
              <li>
                <Link href="/services#maintenance-optimization" className="transition-colors hover:text-white">
                  Optimization &amp; Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Admin Column */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400">Portal</h3>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li>
                <Link href="/admin" className="font-mono text-xs text-neutral-400 hover:text-white underline">
                  Admin Dashboard CMS
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-white">
                  Knowledge &amp; FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row font-mono text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Olinethra Software Agency. All rights reserved.</p>
          <p>Built with Next.js App Router &amp; Monochrome UI</p>
        </div>
      </div>
    </footer>
  )
}
