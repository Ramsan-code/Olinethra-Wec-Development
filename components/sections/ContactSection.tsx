"use client"

import * as React from "react"
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const projectTypes = [
  "Web Application",
  "UI/UX Design",
  "E-Commerce Store",
  "Custom Dashboard",
  "Maintenance & Optimization",
  "Other Inquiry"
]

export default function ContactSection() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    company: "",
    projectType: "Web Application",
    message: "",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Full name is required."
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address."
    }
    if (!formData.message.trim()) newErrors.message = "Project message is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    // Simulate network validation / submit state cleanly
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 800)
  }

  return (
    <section id="contact" className="border-b border-neutral-200 bg-white py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Contact Details & Info (5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                [ START A CONVERSATION ]
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
                Let&apos;s discuss your project.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                Have a new web project, architecture inquiry, or software initiative in mind? Fill out the form or reach out directly to our engineering team.
              </p>
            </div>

            <div className="space-y-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500">Email Address</h4>
                  <a href="mailto:hello@olinethra.com" className="text-base font-bold text-neutral-950 hover:underline dark:text-neutral-50">
                    hello@olinethra.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500">Phone</h4>
                  <p className="text-base font-bold text-neutral-950 dark:text-neutral-50">
                    +1 (555) 019-2834
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-500">HQ & Workspace</h4>
                  <p className="text-base font-bold text-neutral-950 dark:text-neutral-50">
                    San Francisco, CA & Global Remote
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Area (7 columns) */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:p-6 md:p-8 dark:border-neutral-800 dark:bg-neutral-900/60">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-950 dark:text-neutral-50">
                    Message Received
                  </h3>
                  <p className="max-w-md mx-auto text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Thank you for reaching out to Olinethra. Our engineering lead will review your project details and respond within 1 business day.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ name: "", email: "", company: "", projectType: "Web Application", message: "" })
                    }}
                    className="mt-4 border-neutral-300 dark:border-neutral-700"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-500 font-mono">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="sarah@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-xs text-red-500 font-mono">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Company */}
                    <div className="space-y-2">
                      <Label htmlFor="company">Company / Organization</Label>
                      <Input
                        id="company"
                        type="text"
                        placeholder="Nexus Brands Inc."
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>

                    {/* Project Type */}
                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type</Label>
                      <select
                        id="projectType"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="flex h-11 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-visible:ring-neutral-300"
                      >
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Project Description & Scope *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project goals, technical requirements, and target timeline..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && <p className="text-xs text-red-500 font-mono">{errors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full justify-center gap-2 py-6 text-base font-medium"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center font-mono text-xs text-neutral-500">
                    We respect your privacy. All information is confidential.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
