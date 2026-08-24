"use client"

import * as React from "react"
import { Mail, Globe, AlertCircle, Users } from "lucide-react"
import { GithubIcon, LinkedinIcon, MediumIcon } from "@/components/ui/icons"
import { teamData as defaultTeamData } from "@/data/team"
import { CmsStore } from "@/lib/cms"
import { Badge } from "@/components/ui/badge"

function isValidUrl(url?: string): boolean {
  if (!url) return false
  const trimmed = url.trim()
  return trimmed !== "" && trimmed !== "#" && !trimmed.startsWith("javascript:")
}

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isError, setIsError] = React.useState(false)
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
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch team CMS data")
        return res.json()
      })
      .then((data: CmsStore) => {
        if (data?.team && Array.isArray(data.team)) {
          const activeOnly = data.team.filter((t) => t.status === "Active" || t.published === true)
          setTeamMembers(activeOnly.length > 0 ? activeOnly : defaultTeamData)
        } else {
          setTeamMembers(defaultTeamData)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Team Section fetch error:", err)
        setTeamMembers(defaultTeamData)
        setIsLoading(false)
      })
  }, [])

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

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden space-y-4 p-4">
                <div className="aspect-4/5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        ) : teamMembers.length === 0 ? (
          /* Empty State Fallback */
          <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-800 space-y-2">
            <Users className="h-8 w-8 mx-auto text-neutral-400" />
            <h3 className="font-bold text-sm text-neutral-950 dark:text-neutral-50">No Published Team Members</h3>
            <p className="text-xs text-neutral-500">Team information is currently being updated by administrators.</p>
          </div>
        ) : (
          /* Responsive Team Grid: Mobile 1-col, Tablet 2-col, Desktop 3/4-col */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {teamMembers.map((member: any, index: number) => {
              const photoUrl = member.photoUrl || member.photo || member.avatar
              const githubUrl = member.githubUrl || member.github
              const linkedinUrl = member.linkedinUrl || member.linkedin
              const mediumUrl = member.mediumUrl || member.medium
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
                  <div className="flex flex-col flex-1">
                    {/* Full Team Photo Container */}
                    <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                      {photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={photoUrl}
                          alt={`${member.name} - ${member.role}`}
                          className="h-full w-full object-cover object-top transition-all duration-500 ease-out filter grayscale group-hover:grayscale-0 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-white font-mono text-3xl font-bold dark:bg-neutral-900">
                          {member.initials || member.name?.slice(0, 2).toUpperCase() || "OL"}
                        </div>
                      )}
                      {member.department && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="monochrome" className="text-[10px] bg-neutral-950/80 backdrop-blur-xs text-white">
                            {member.department}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-950 dark:text-neutral-50 transition-colors duration-200 group-hover:text-neutral-900 dark:group-hover:text-white">
                          {member.name}
                        </h3>
                        <p className="font-mono text-xs text-neutral-500 font-medium mt-0.5 dark:text-neutral-400">
                          {member.role}
                        </p>

                        {member.bio && (
                          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 mt-3 line-clamp-3">
                            {member.bio}
                          </p>
                        )}
                      </div>

                      {/* Key Skills Tags */}
                      {member.skills && member.skills.length > 0 && (
                        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 mt-3">
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
                    </div>
                  </div>

                  {/* Sanitized Social Links (Only render valid URLs) */}
                  <div className="p-5 sm:p-6 pt-0">
                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      {isValidUrl(linkedinUrl) && (
                        <a
                          href={linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                          aria-label={`${member.name} LinkedIn Profile`}
                        >
                          <LinkedinIcon className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {isValidUrl(githubUrl) && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                          aria-label={`${member.name} GitHub Profile`}
                        >
                          <GithubIcon className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {isValidUrl(mediumUrl) && (
                        <a
                          href={mediumUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                          aria-label={`${member.name} Medium Writing Profile`}
                          title={`${member.name}'s writing on Medium`}
                        >
                          <MediumIcon className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {isValidUrl(portfolioUrl) && (
                        <a
                          href={portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                          aria-label={`${member.name} Personal Portfolio Website`}
                        >
                          <Globe className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {isValidUrl(email) && (
                        <a
                          href={email.startsWith("mailto:") ? email : `mailto:${email}`}
                          className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-all duration-200 hover:border-neutral-400 hover:text-neutral-950 hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                          aria-label={`Send Email to ${member.name}`}
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
        )}
      </div>
    </section>
  )
}
