import Link from "next/link"
import { Code2, Mail } from "lucide-react"
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons"

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-950 text-neutral-100 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand Info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-neutral-950 font-mono text-xs">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="font-mono tracking-wider text-base uppercase text-white">OLINETHRA</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-neutral-400">
              Olinethra is a full-stack web development agency and software studio. We design, architect, and build modern digital experiences, web applications, and enterprise software solutions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white"
                aria-label="GitHub"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@olinethra.com"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:border-neutral-600 hover:text-white"
                aria-label="Email"
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
                <Link href="/" className="transition-colors hover:text-white">Home</Link>
              </li>
              <li>
                <Link href="/services" className="transition-colors hover:text-white">Services</Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">About Us</Link>
              </li>
              <li>
                <Link href="/projects" className="transition-colors hover:text-white">Projects & Work</Link>
              </li>
              <li>
                <Link href="/team" className="transition-colors hover:text-white">Our Team</Link>
              </li>
              <li>
                <Link href="/careers" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
                  Careers & Internships
                  <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300 uppercase">Hiring</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Core Services Column */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400">Services</h3>
            <ul className="space-y-2.5 text-sm text-neutral-300">
              <li>
                <Link href="/services#web-development" className="transition-colors hover:text-white">Web Development</Link>
              </li>
              <li>
                <Link href="/services#ui-ux-design" className="transition-colors hover:text-white">UI/UX Design Systems</Link>
              </li>
              <li>
                <Link href="/services#full-stack-development" className="transition-colors hover:text-white">Full-Stack Development</Link>
              </li>
              <li>
                <Link href="/services#e-commerce-development" className="transition-colors hover:text-white">E-Commerce Engineering</Link>
              </li>
              <li>
                <Link href="/services#custom-software" className="transition-colors hover:text-white">Custom Business Dashboards</Link>
              </li>
              <li>
                <Link href="/services#maintenance-optimization" className="transition-colors hover:text-white">Performance Optimization</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Location Column */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400">Get In Touch</h3>
            <div className="space-y-2 text-sm text-neutral-300">
              <p className="font-medium text-white">General Inquiries</p>
              <a href="mailto:hello@olinethra.com" className="block text-neutral-400 hover:text-white transition-colors">
                hello@olinethra.com
              </a>
              <p className="mt-3 font-medium text-white">Careers & Internships</p>
              <a href="mailto:careers@olinethra.com" className="block text-neutral-400 hover:text-white transition-colors">
                careers@olinethra.com
              </a>
              <p className="mt-3 font-medium text-white">Location</p>
              <p className="text-neutral-400">San Francisco, CA & Global Remote</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row text-xs text-neutral-400">
          <p>© 2026 Olinethra. All rights reserved.</p>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-wider">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
