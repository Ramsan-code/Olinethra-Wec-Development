export interface TeamMember {
  id: string
  name: string
  role: string
  department?: string
  bio: string
  photoUrl?: string
  skills: string[]
  githubUrl?: string
  linkedinUrl?: string
  mediumUrl?: string
  initials: string
}

export const teamData: TeamMember[] = [
  {
    id: "thavam-ramsan",
    name: "Thavam Ramsan",
    role: "Founder & Lead Developer",
    department: "Executive & Engineering",
    bio: "Systems architect and full-stack software engineer with deep expertise scaling Next.js applications, cloud APIs, and high-performance digital products.",
    skills: ["Next.js", "TypeScript", "Node.js", "System Architecture", "Tailwind CSS"],
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
    githubUrl: "https://github.com/olinethra",
    linkedinUrl: "https://linkedin.com/company/olinethra",
    mediumUrl: "https://medium.com/@thavamramsan",
    initials: "TR",
  },
  {
    id: "alexander-wright",
    name: "Alexander Wright",
    role: "Engineering Director",
    department: "Engineering",
    bio: "Technology strategist with over 10 years of experience scaling web applications, serverless microservices, and digital infrastructure.",
    skills: ["System Architecture", "Product Strategy", "Next.js", "Engineering Leadership"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600",
    githubUrl: "https://github.com/olinethra",
    linkedinUrl: "https://linkedin.com/company/olinethra",
    initials: "AW",
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Lead Full-Stack Developer",
    department: "Engineering",
    bio: "Full-stack engineer specialized in distributed systems, high-performance Node.js APIs, and modern React App Router architectures.",
    skills: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600",
    githubUrl: "https://github.com/olinethra",
    linkedinUrl: "https://linkedin.com/company/olinethra",
    initials: "ER",
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "UI/UX Design Director",
    department: "Product & Design",
    bio: "Product designer focused on minimal design systems, typography hierarchy, accessibility, and high-converting user interfaces.",
    skills: ["Design Systems", "Figma", "User Research", "Wireframing", "CSS Architecture"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600",
    githubUrl: "https://github.com/olinethra",
    linkedinUrl: "https://linkedin.com/company/olinethra",
    initials: "MV",
  },
  {
    id: "sophia-chen",
    name: "Sophia Chen",
    role: "Frontend Engineer",
    department: "Engineering",
    bio: "Frontend craftsman passionate about micro-interactions, responsive CSS layouts, performance optimization, and Core Web Vitals.",
    skills: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Web Vitals"],
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600",
    githubUrl: "https://github.com/olinethra",
    linkedinUrl: "https://linkedin.com/company/olinethra",
    initials: "SC",
  },
  {
    id: "david-miller",
    name: "David Miller",
    role: "Backend & Database Architect",
    department: "Engineering",
    bio: "Backend developer specializing in database query optimization, security protocols, cloud microservices, and serverless APIs.",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST & GraphQL"],
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600",
    githubUrl: "https://github.com/olinethra",
    linkedinUrl: "https://linkedin.com/company/olinethra",
    initials: "DM",
  },
]
