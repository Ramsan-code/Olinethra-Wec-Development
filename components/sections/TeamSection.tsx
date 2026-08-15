"use client"

import * as React from "react"
import Image from "next/image"
import { Mail, Globe } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons"
import { teamData as defaultTeamData } from "@/data/team"
import { TeamMemberItem, CmsStore } from "@/lib/cms"
import { Badge } from "@/components/ui/badge"

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = React.useState<any[]>([])
  const sectionRef = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    fetch("/api/admin/cms")
      .then((res) => res.json())
      .then((data: CmsStore) => {
        if (data?.team && data.team.length > 0) {
          const activeOnly = data.team.filter((t) => t.status === "Active")
          setTeamMembers(activeOnly)
        }
      })
      .catch(() => {})
  }, [])

  const displayTeam = teamMembers.length > 0 ? teamMembers : defaultTeamData

  return (
    <section
      id="team"
      ref={sectionRef}
      className="border-b border-neutral-200 bg-white py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-950 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-12 sm:mb-16 transition-all duration-500 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              [ LEADERSHIP &amp; TALENT ]
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
              The Engineering &amp; Design Team
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            A cohesive team of developers, architects, and designers with deep domain expertise in building web software.
          </p>
        </div>

        {/* Responsive Grid: Mobile 1-col, Tablet 2-col, Desktop 3-col or 4-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {displayTeam.map((member: any, index: number) => {
            const photoUrl = member.photoUrl || member.photo || member.avatar
            const githubUrl = member.githubUrl || member.github
            const linkedinUrl = member.linkedinUrl || member.linkedin
            const portfolioUrl = member.portfolioUrl || member.portfolio
            const email = member.email

            return (
              <div
                key={member.id || member.name}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
                className={`group flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all duration-300 ease-out hover:border-neutral-400 hover:shadow-lg hover:-translate-y-1.5 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div>
                  {/* Full Team Photo Card with consistent aspect ratio */}
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`${member.name} - ${member.role}`}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-white font-mono text-3xl font-bold dark:bg-neutral-900">
                        {member.initials || member.name?.slice(0, 2).toUpperCase() || "OL"}
                      </div>
                    )}
                    {/* Department Tag Overlay */}
                    {member.department && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="monochrome" className="text-[10px] bg-neutral-950/80 backdrop-blur-xs text-white">
                          {member.department}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Member Details */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-950 dark:text-neutral-50 transition-colors duration-200 group-hover:text-neutral-900 dark:group-hover:text-white">
                          {member.name}
                        </h3>
                        <p className="font-mono text-xs text-neutral-500 font-medium mt-0.5 dark:text-neutral-400">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {member.bio && (
                      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 space-y-4">
                  {/* Key Skills Tags */}
                  {member.skills && member.skills.length > 0 && (
                    <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex flex-wrap gap-1.5">
                        {member.skills.slice(0, 4).map((skill: any) => (
                          <span
                            key={skill}
                            className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <LinkedinIcon className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        aria-label={`${member.name} GitHub`}
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {portfolioUrl && (
                      <a
                        href={portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        aria-label={`${member.name} Portfolio`}
                      >
                        <Globe className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
