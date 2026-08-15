import { GithubIcon, LinkedinIcon } from "@/components/ui/icons"
import { teamData, TeamMember } from "@/data/team"

export default function TeamSection() {
  return (
    <section id="team" className="border-b border-neutral-200 bg-white py-16 sm:py-24 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-12 sm:mb-16">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              [ LEADERSHIP & TALENT ]
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
              The Engineering & Design Team
            </h2>
          </div>
          <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            A cohesive team of developers, architects, and designers with deep domain expertise in building web software.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamData.map((member: TeamMember) => (
            <div
              key={member.id}
              className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 sm:p-7 transition-all duration-200 hover:border-neutral-400 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
            >
              <div>
                {/* Avatar / Initials Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-900 text-white font-mono text-lg font-bold dark:border-neutral-700 dark:bg-neutral-100 dark:text-neutral-900">
                    {member.initials}
                  </div>
                  <div className="flex items-center gap-2">
                    {member.githubUrl && (
                      <a
                        href={member.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        aria-label={`${member.name} GitHub`}
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors hover:border-neutral-400 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="text-xl font-bold text-neutral-950 dark:text-neutral-50">
                  {member.name}
                </h3>
                <p className="font-mono text-xs text-neutral-500 font-medium mt-0.5 mb-4 dark:text-neutral-400">
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6">
                  {member.bio}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[10px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
