export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  initials: string;
}

export const teamData: TeamMember[] = [
  {
    id: "alexander-wright",
    name: "Alexander Wright",
    role: "Founder & CEO",
    bio: "Systems architect and technology strategist with over 10 years of experience scaling web applications and digital infrastructure.",
    skills: ["System Architecture", "Product Strategy", "Next.js", "Engineering Leadership"],
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    initials: "AW"
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Lead Full-Stack Developer",
    bio: "Full-stack engineer specialized in distributed systems, high-performance Node.js APIs, and modern React architectures.",
    skills: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    initials: "ER"
  },
  {
    id: "marcus-vance",
    name: "Marcus Vance",
    role: "UI/UX Design Director",
    bio: "Product designer focused on minimal design systems, typography hierarchy, accessibility, and high-converting user interfaces.",
    skills: ["Design Systems", "Figma", "User Research", "Wireframing", "CSS Architecture"],
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    initials: "MV"
  },
  {
    id: "sophia-chen",
    name: "Sophia Chen",
    role: "Frontend Developer",
    bio: "Frontend craftsman passionate about micro-interactions, responsive CSS layouts, performance optimization, and Web Vitals.",
    skills: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Web Vitals"],
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    initials: "SC"
  },
  {
    id: "david-miller",
    name: "David Miller",
    role: "Backend & Database Engineer",
    bio: "Backend developer specializing in database query optimization, security protocols, cloud microservices, and serverless APIs.",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST & GraphQL"],
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    initials: "DM"
  },
  {
    id: "aria-patel",
    name: "Aria Patel",
    role: "QA & Reliability Engineer",
    bio: "Quality assurance engineer dedicated to end-to-end automated testing, accessibility standards validation, and stress testing.",
    skills: ["Automated Testing", "Playwright", "Jest", "Accessibility (WCAG)", "CI/CD"],
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    initials: "AP"
  }
];
