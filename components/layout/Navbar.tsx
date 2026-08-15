"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ArrowUpRight, Code2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Team", href: "/team" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-neutral-900 transition-opacity hover:opacity-80 dark:text-neutral-50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white font-mono text-xs dark:bg-neutral-100 dark:text-neutral-900 transition-transform group-hover:scale-105">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="font-mono tracking-wider text-base uppercase">OLINETHRA</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-0.5 lg:gap-1.5 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-md px-2.5 lg:px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-50 font-semibold"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="default" size="sm" className="rounded-md px-4 font-medium tracking-wide">
            <Link href="/contact" className="flex items-center gap-1.5">
              Start a Project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Sheet */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-neutral-300 dark:border-neutral-700"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5 text-neutral-800 dark:text-neutral-200" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[85vw] max-w-[320px] sm:w-[340px] border-l border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-950">
              <SheetHeader className="text-left pb-4 border-b border-neutral-200 dark:border-neutral-800">
                <SheetTitle className="flex items-center gap-2 text-lg font-mono tracking-wider text-neutral-900 dark:text-neutral-100">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                    <Code2 className="h-3.5 w-3.5" />
                  </div>
                  OLINETHRA
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-1.5" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                          : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {link.name}
                      <ArrowUpRight className="h-4 w-4 opacity-50" />
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <Button asChild className="w-full justify-center gap-2 rounded-lg py-3 text-sm font-medium min-h-[44px]">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Start a Project
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <div className="mt-6 text-center text-xs text-neutral-500 font-mono">
                  hello@olinethra.com
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
