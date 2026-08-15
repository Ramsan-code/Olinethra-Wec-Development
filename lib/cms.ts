import fs from "fs"
import path from "path"
import { servicesData } from "@/data/services"
import { faqsData } from "@/data/faqs"
import { processData } from "@/data/process"
import { projectsData } from "@/data/projects"
import { teamData } from "@/data/team"
import { careersData } from "@/data/careers"

export interface TeamMemberItem {
  id: string
  name: string
  role: string
  department: string
  bio: string
  photoUrl: string
  skills: string[]
  linkedin?: string
  github?: string
  portfolio?: string
  email?: string
  displayOrder: number
  status: "Active" | "Inactive"
}

export interface InternshipItem {
  id: string
  title: string
  department: string
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  duration: string
  location: string
  workType: "Remote" | "Hybrid" | "On-site"
  deadline: string
  vacancies: number
  status: "Open" | "Closed" | "Draft"
  applicationLink: string
  isFeatured: boolean
}

export interface JobItem {
  id: string
  title: string
  department: string
  employmentType: "Full-time" | "Part-time" | "Contract"
  location: string
  workType: "Remote" | "Hybrid" | "On-site"
  salary?: string
  description: string
  responsibilities: string[]
  requirements: string[]
  skills: string[]
  deadline: string
  applicationUrl: string
  status: "Open" | "Paused" | "Closed"
  isFeatured: boolean
}

export interface ProjectCMSItem {
  id: string
  title: string
  slug?: string
  description: string
  thumbnail: string
  heroImage?: string
  gallery: string[]
  videoUrl?: string
  videoPoster?: string
  technologies: string[]
  category: string
  client: string
  projectUrl: string
  githubUrl?: string
  caseStudy: string
  challenges?: string
  solution?: string
  results?: string
  isFeatured: boolean
  displayOrder: number
  status: "Published" | "Draft"
  metrics?: Array<{ label: string; value: string }>
}

export interface ServiceCMSItem {
  id: string
  title: string
  shortDesc: string
  fullDesc: string
  iconName: string
  features: string[]
  deliverables: string[]
  displayOrder: number
  status: "Active" | "Inactive"
}

export interface FAQCMSItem {
  id: string
  question: string
  answer: string
  category: "General" | "Services" | "Pricing" | "Development" | "Internships" | "Hiring" | "Technology" | "Projects"
  displayOrder: number
  published: boolean
}

export interface ChatbotKnowledgeItem {
  id: string
  topic: string
  question: string
  answer: string
  category: string
  lastUpdated: string
}

export interface SiteSettings {
  heroHeading: string
  heroSubheading: string
  heroBadgeText: string
  aboutHeading: string
  aboutDescription: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  footerTagline: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
  facebookUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
}

export interface ApplicationItem {
  id: string
  applicantName: string
  email: string
  phone: string
  opportunityTitle: string
  opportunityType: "Internship" | "Job"
  resumeUrl: string
  coverNote?: string
  appliedDate: string
  status: "New" | "Reviewing" | "Shortlisted" | "Rejected" | "Accepted"
}

export interface ProjectInquiryItem {
  id: string
  name: string
  email: string
  company: string
  projectType: string
  budget?: string
  priority?: "HIGH" | "MEDIUM" | "LOW"
  message: string
  date: string
  status: "New" | "Contacted" | "Discussion" | "Proposal" | "Won" | "Lost"
}

export interface NotificationItem {
  id: string
  type: "inquiry" | "application" | "status" | "expiry"
  title: string
  message: string
  date: string
  read: boolean
  link?: string
}

export interface ActivityLogItem {
  id: string
  user: string
  action: string
  entity: string
  date: string
}

export interface CmsStore {
  team: TeamMemberItem[]
  internships: InternshipItem[]
  jobs: JobItem[]
  projects: ProjectCMSItem[]
  services: ServiceCMSItem[]
  faqs: FAQCMSItem[]
  chatbotKnowledge: ChatbotKnowledgeItem[]
  siteSettings: SiteSettings
  applications: ApplicationItem[]
  inquiries: ProjectInquiryItem[]
  notifications?: NotificationItem[]
  activityLog?: ActivityLogItem[]
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "cmsData.json")

function getSeedData(): CmsStore {
  return {
    team: teamData.map((t: any, idx: number) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      department: t.department || "Engineering",
      bio: t.bio,
      photoUrl: t.photoUrl || t.photo || t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600",
      skills: t.skills || ["TypeScript", "Next.js"],
      linkedin: t.linkedinUrl || t.socialLinks?.linkedin || t.linkedin || "https://linkedin.com",
      github: t.githubUrl || t.socialLinks?.github || t.github || "https://github.com",
      email: t.email || "dev@olinethra.com",
      displayOrder: idx + 1,
      status: "Active",
    })),

    internships: careersData.map((i: any) => ({
      id: i.id,
      title: i.title,
      department: i.department || "Engineering",
      description: i.description || i.shortDesc || "",
      responsibilities: i.responsibilities || [],
      requirements: i.requirements || [],
      skills: i.skills || ["React", "TypeScript"],
      duration: i.duration || "3 - 6 Months",
      location: i.location || "San Francisco, CA / Remote",
      workType: (i.workType || i.type || "Remote") as "Remote" | "Hybrid" | "On-site",
      deadline: i.deadline || "2026-10-30",
      vacancies: i.vacancies || 2,
      status: (i.status || "Open") as "Open" | "Closed" | "Draft",
      applicationLink: i.applicationLink || i.applyEmail || "mailto:careers@olinethra.com",
      isFeatured: i.isFeatured ?? true,
    })),

    jobs: [
      {
        id: "job-senior-frontend",
        title: "Senior Next.js / Frontend Engineer",
        department: "Engineering",
        employmentType: "Full-time",
        location: "San Francisco, CA / Remote",
        workType: "Remote",
        salary: "$120,000 - $150,000 / year",
        description:
          "Lead the frontend architecture of high-scale web platforms using Next.js App Router, TypeScript, and custom UI design systems.",
        responsibilities: [
          "Architect clean, reusable TypeScript UI components.",
          "Optimize Core Web Vitals to achieve 99+ performance scores.",
          "Mentor junior engineers and lead code reviews.",
        ],
        requirements: [
          "4+ years experience with React, Next.js, and TypeScript.",
          "Strong mastery of Tailwind CSS and design system principles.",
          "Proven track record delivering production web software.",
        ],
        skills: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Design Systems"],
        deadline: "2026-09-30",
        applicationUrl: "mailto:careers@olinethra.com?subject=Senior%20Frontend%20Engineer",
        status: "Open",
        isFeatured: true,
      },
      {
        id: "job-fullstack-dev",
        title: "Full-Stack Software Engineer (Node + PostgreSQL)",
        department: "Engineering",
        employmentType: "Full-time",
        location: "Remote",
        workType: "Remote",
        salary: "$110,000 - $140,000 / year",
        description:
          "Design and implement scalable backend APIs, database schemas, and microservices paired with Next.js client applications.",
        responsibilities: [
          "Develop RESTful APIs and serverless microservices.",
          "Design PostgreSQL & MongoDB schemas with Prisma ORM.",
          "Ensure top-tier security, authentication, and database speed.",
        ],
        requirements: [
          "3+ years building Node.js / Express backend systems.",
          "Proficiency with SQL, relational database design, and cloud deployments.",
        ],
        skills: ["Node.js", "Express", "PostgreSQL", "Prisma", "TypeScript"],
        deadline: "2026-10-15",
        applicationUrl: "mailto:careers@olinethra.com?subject=Full-Stack%20Engineer",
        status: "Open",
        isFeatured: false,
      },
    ],

    projects: projectsData.map((p: any, idx: number) => ({
      id: p.id,
      title: p.title,
      description: p.description || p.summary || "",
      thumbnail: p.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
      gallery: [p.image || ""],
      technologies: p.technologies || [],
      category: p.category || "Web Application",
      client: p.client || "Client Project",
      projectUrl: p.demoUrl || p.projectUrl || "#",
      githubUrl: p.githubUrl,
      caseStudy: p.fullCaseStudy || p.description || "",
      isFeatured: p.isFeatured ?? true,
      displayOrder: idx + 1,
      status: "Published",
      metrics: p.metrics,
    })),

    services: servicesData.map((s: any, idx: number) => ({
      id: s.id,
      title: s.title,
      shortDesc: s.shortDesc,
      fullDesc: s.fullDesc,
      iconName: s.iconName,
      features: s.features,
      deliverables: s.deliverables,
      displayOrder: idx + 1,
      status: "Active",
    })),

    faqs: faqsData.map((f: any, idx: number) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: (f.category as any) || "General",
      displayOrder: idx + 1,
      published: true,
    })),

    chatbotKnowledge: [
      {
        id: "kb-1",
        topic: "Company Overview",
        question: "What is Olinethra?",
        answer:
          "Olinethra is an engineering-first full-stack software development agency based in San Francisco with a global remote team. We engineer production-ready web apps, custom software, and modern websites with 100% source code ownership transfer.",
        category: "Company",
        lastUpdated: "2026-08-15",
      },
      {
        id: "kb-2",
        topic: "Pricing & Retainers",
        question: "How much does a custom project cost?",
        answer:
          "Project pricing is milestone-based: Startup Sprints for MVPs, Full Product Engineering for custom web apps, and Enterprise Retainers for dedicated engineering staff. Contact hello@olinethra.com for a custom proposal.",
        category: "Pricing",
        lastUpdated: "2026-08-15",
      },
    ],

    siteSettings: {
      heroHeading: "Building Digital Experiences That Matter.",
      heroSubheading:
        "Olinethra is a professional web development studio. We design, architect, and engineer production-grade web applications, modern websites, and digital systems built for reliability and performance.",
      heroBadgeText: "AVAILABLE FOR NEW PROJECTS & COLLABORATIONS",
      aboutHeading: "An engineering-first software studio focused on craft & performance.",
      aboutDescription:
        "Olinethra was founded to bridge the gap between technical complexity and refined product design. We architect bespoke digital products, web applications, and marketing platforms built for growth.",
      contactEmail: "hello@olinethra.com",
      contactPhone: "+1 (555) 019-2834",
      contactAddress: "San Francisco, CA & Global Remote",
      footerTagline: "Building high-performance digital products and scalable web applications.",
      githubUrl: "https://github.com/olinethra",
      linkedinUrl: "https://linkedin.com/company/olinethra",
      twitterUrl: "https://twitter.com/olinethra",
      facebookUrl: "https://facebook.com/olinethra",
      instagramUrl: "https://instagram.com/olinethra",
      youtubeUrl: "https://youtube.com/@olinethra",
    },

    applications: [
      {
        id: "app-101",
        applicantName: "Alex Rivera",
        email: "alex.rivera@example.com",
        phone: "+1 (555) 234-5678",
        opportunityTitle: "Full Stack Web Development Intern",
        opportunityType: "Internship",
        resumeUrl: "https://example.com/resumes/alex-rivera.pdf",
        coverNote: "Passionate CS senior eager to build Next.js applications at Olinethra.",
        appliedDate: "2026-08-14",
        status: "Reviewing",
      },
      {
        id: "app-102",
        applicantName: "Elena Rostova",
        email: "elena.rostova@example.com",
        phone: "+1 (555) 987-6543",
        opportunityTitle: "Senior Next.js / Frontend Engineer",
        opportunityType: "Job",
        resumeUrl: "https://example.com/resumes/elena-rostova.pdf",
        coverNote: "5 years building complex SaaS dashboards in React and TypeScript.",
        appliedDate: "2026-08-15",
        status: "Shortlisted",
      },
    ],

    inquiries: [
      {
        id: "inq-201",
        name: "Marcus Vance",
        email: "marcus@finovate.io",
        company: "Finovate Solutions",
        projectType: "Web Application",
        budget: "$20,000 - $40,000",
        priority: "HIGH",
        message: "We need a real-time analytics dashboard built with Next.js and PostgreSQL.",
        date: "2026-08-15",
        status: "New",
      },
      {
        id: "inq-202",
        name: "Sarah Chen",
        email: "sarah@aurafashion.com",
        company: "Aura Fashion",
        projectType: "E-Commerce Store",
        budget: "$15,000 - $25,000",
        priority: "HIGH",
        message: "Looking for a headless Shopify storefront with Stripe integration.",
        date: "2026-08-13",
        status: "Discussion",
      },
    ],

    notifications: [
      {
        id: "notif-1",
        type: "inquiry",
        title: "New Project Inquiry Received",
        message: "Marcus Vance submitted a project inquiry for Web Application Development.",
        date: "2026-08-15",
        read: false,
        link: "/admin/inquiries",
      },
      {
        id: "notif-2",
        type: "application",
        title: "New Internship Application",
        message: "Alex Rivera applied for Full Stack Web Development Intern position.",
        date: "2026-08-14",
        read: true,
        link: "/admin/applications",
      },
    ],

    activityLog: [
      {
        id: "act-1",
        user: "System",
        action: "Initialized CMS Store",
        entity: "System",
        date: new Date().toISOString(),
      },
    ],
  }
}

export function getCmsData(): CmsStore {
  try {
    let data: CmsStore
    if (!fs.existsSync(DATA_FILE_PATH)) {
      data = getSeedData()
      fs.mkdirSync(path.dirname(DATA_FILE_PATH), { recursive: true })
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8")
    } else {
      const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8")
      data = JSON.parse(fileContent) as CmsStore
    }

    if (!data.notifications) data.notifications = []
    if (!data.activityLog) data.activityLog = []

    // Automatic Internship & Job Expiry Automation
    const today = new Date().toISOString().split("T")[0]
    let modified = false

    data.internships = data.internships.map((item) => {
      if (item.deadline && item.deadline < today && item.status === "Open") {
        modified = true
        return { ...item, status: "Closed" as const }
      }
      return item
    })

    data.jobs = data.jobs.map((item) => {
      if (item.deadline && item.deadline < today && item.status === "Open") {
        modified = true
        return { ...item, status: "Closed" as const }
      }
      return item
    })

    if (modified) {
      saveCmsData(data)
    }

    return data
  } catch (error) {
    console.error("Error reading CMS data, returning seed:", error)
    return getSeedData()
  }
}

export function saveCmsData(data: CmsStore): void {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE_PATH), { recursive: true })
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch (error) {
    console.error("Error saving CMS data:", error)
  }
}
