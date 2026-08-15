export interface KnowledgeBase {
  company: {
    name: string
    tagline: string
    description: string
    capabilities: string[]
    whyChooseUs: string[]
    contactEmail: string
    careerEmail: string
    location: string
  }
  services: Array<{
    id: string
    name: string
    description: string
    features: string[]
    deliverables: string[]
  }>
  technologies: Array<{
    category: string
    tools: string[]
    description: string
  }>
  process: Array<{
    step: string
    title: string
    description: string
  }>
  projects: Array<{
    title: string
    client: string
    category: string
    summary: string
    technologies: string[]
    metrics: Array<{ label: string; value: string }>
  }>
  pricing: {
    overview: string
    models: Array<{
      name: string
      tagline: string
      target: string
      pricingType: string
      features: string[]
    }>
    factors: string[]
    timelines: string
  }
  faqs: Array<{
    question: string
    answer: string
    category: string
  }>
}

export const knowledgeBase: KnowledgeBase = {
  company: {
    name: "Olinethra",
    tagline: "Building Digital Experiences That Matter",
    description:
      "Olinethra is a full-stack web development agency and software studio. We design, architect, and engineer production-grade web applications, modern company websites, headless e-commerce platforms, and custom digital software built for reliability, security, and peak performance.",
    capabilities: [
      "Custom Next.js & React Web Application Development",
      "Full-Stack Engineering (Node.js, Express, PostgreSQL, MongoDB)",
      "UI/UX Design Systems, Wireframing & Interactive Prototypes",
      "Headless E-Commerce Storefronts & Stripe Payment Gateways",
      "Custom Enterprise & Internal Admin Dashboards",
      "Core Web Vitals Performance Tuning & SLA Technical Support",
    ],
    whyChooseUs: [
      "Engineering Discipline: Clean, strictly-typed TypeScript code structured for long-term maintainability.",
      "100% Code & IP Ownership: Full transfer of source code, design assets, and repository ownership upon completion.",
      "Performance First: 99+ Core Web Vitals optimization for fast load speeds and strong SEO rankings.",
      "Predictable Milestones: Agile sprint cycles with complete transparency and clear progress reports.",
    ],
    contactEmail: "hello@olinethra.com",
    careerEmail: "careers@olinethra.com",
    location: "San Francisco, CA & Global Remote",
  },

  services: [
    {
      id: "web-development",
      name: "Web Development",
      description:
        "High-performance, scalable web applications built with modern frameworks like Next.js, React, and TypeScript. Designed for speed, responsiveness, and conversion.",
      features: [
        "Next.js App Router Architecture",
        "Server-Side Rendering (SSR) & Static Site Generation (SSG)",
        "API Integration & Seamless State Management",
        "Core Web Vitals & Technical SEO Optimization",
      ],
      deliverables: ["Production Web Application", "TypeScript Source Code", "CI/CD Pipeline Setup", "Documentation & Specs"],
    },
    {
      id: "ui-ux-design",
      name: "UI/UX Design Systems",
      description:
        "Intuitive, user-centered interface designs crafted for high engagement, brand identity, and smooth user navigation.",
      features: [
        "Figma Design Systems & Reusable Token Libraries",
        "Wireframing & High-Fidelity Interactive Prototypes",
        "User Journey & Workflow Optimization",
        "Pixel-Perfect Mobile & Desktop Layouts",
      ],
      deliverables: ["Figma Design Files", "Interactive Prototypes", "Design Token Guides", "Component Specs"],
    },
    {
      id: "full-stack-development",
      name: "Full-Stack Software Engineering",
      description:
        "Comprehensive software solutions spanning frontends, REST/GraphQL APIs, and robust relational/NoSQL databases.",
      features: [
        "RESTful API & Serverless Backend Microservices",
        "Database Architecture (PostgreSQL, MongoDB, Prisma)",
        "Authentication & Role-Based Access Control (RBAC)",
        "Cloud Deployment & Infrastructure (Vercel, AWS)",
      ],
      deliverables: ["Full-Stack Software Suite", "API Specs", "Database Schema", "Security Audit"],
    },
    {
      id: "e-commerce-development",
      name: "E-Commerce Engineering",
      description:
        "Custom online stores and headless commerce platforms optimized for high checkout conversion, security, and speed.",
      features: [
        "Headless Commerce Architectures",
        "Stripe & Credit Card Payment Integrations",
        "Product Catalog & Cart Management",
        "Order Fulfillment & Inventory Synchronization",
      ],
      deliverables: ["Custom E-Commerce Store", "Payment Gateway Setup", "CMS Management", "Analytics Setup"],
    },
    {
      id: "custom-software",
      name: "Custom Software & Admin Dashboards",
      description:
        "Bespoke internal business software, administrative portals, CRM tools, and workflow automation systems.",
      features: [
        "Internal Business & Analytics Dashboards",
        "Workflow & Data Pipeline Automation",
        "Third-Party Service & API Integrations",
        "Custom Data Visualization & Reporting",
      ],
      deliverables: ["Custom Admin Portal", "Role Access Management", "Integration Suite", "Staff Onboarding Docs"],
    },
    {
      id: "maintenance-optimization",
      name: "Performance Tuning & Maintenance",
      description:
        "Proactive technical support, performance auditing, security patching, and ongoing cloud infrastructure scaling.",
      features: [
        "Core Web Vitals Audit & Load Speed Optimization",
        "Security Patching & Dependency Updates",
        "24/7 Error Monitoring & SLA Support",
        "Continuous Feature Enhancements",
      ],
      deliverables: ["Monthly Performance Audits", "Priority Tech Support", "Security Compliance Reports", "Uptime SLAs"],
    },
  ],

  technologies: [
    {
      category: "Frontend Stack",
      tools: ["Next.js (App Router)", "React 19", "TypeScript", "Tailwind CSS", "shadcn/ui", "Lucide Icons"],
      description: "Modern, component-driven frontend architecture emphasizing speed, accessibility, and type safety.",
    },
    {
      category: "Backend & Cloud Stack",
      tools: ["Node.js", "Express.js", "PostgreSQL", "MongoDB", "Prisma ORM", "REST APIs", "Vercel Cloud"],
      description: "Scalable backend services, secure database schemas, serverless functions, and robust API endpoints.",
    },
    {
      category: "UI & Tooling Stack",
      tools: ["Figma", "Git / GitHub", "Vercel", "npm", "Postman", "ESLint"],
      description: "Professional design and development tooling for seamless team collaboration and automated continuous deployment.",
    },
  ],

  process: [
    { step: "01", title: "Discovery & Architecture", description: "Technical scoping, goal alignment, domain research, and preliminary architecture map." },
    { step: "02", title: "UI/UX & Wireframing", description: "Designing component wireframes, user flows, and high-fidelity Figma design tokens." },
    { step: "03", title: "Agile Development", description: "Full-stack sprint execution with clean, modular TypeScript code and weekly demos." },
    { step: "04", title: "Quality Assurance & Testing", description: "Cross-browser testing, mobile responsive checks, security audits, and speed optimization." },
    { step: "05", title: "Cloud Deployment", description: "Configuring CI/CD pipelines, SSL certificates, DNS routing, and production launch." },
    { step: "06", title: "Maintenance & SLA Support", description: "Continuous monitoring, dependency updates, SLA guarantees, and ongoing feature updates." },
  ],

  projects: [
    {
      title: "Fintech SaaS Platform",
      client: "Finova Technologies",
      category: "SaaS Analytics",
      summary: "A real-time financial analytics dashboard handling high-frequency transaction data with interactive charts.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      metrics: [
        { label: "Load Time", value: "0.4s" },
        { label: "Daily Active Users", value: "45K+" },
        { label: "Uptime", value: "99.99%" },
      ],
    },
    {
      title: "Headless E-Commerce Storefront",
      client: "Aura Apparel",
      category: "E-Commerce",
      summary: "Ultra-fast headless online store with instant page transitions, custom cart management, and Stripe integration.",
      technologies: ["Next.js", "Shopify Storefront API", "Tailwind CSS", "Stripe"],
      metrics: [
        { label: "Checkout Conversion", value: "+38%" },
        { label: "Page Speed Score", value: "99/100" },
        { label: "Mobile Traffic", value: "72%" },
      ],
    },
    {
      title: "Enterprise Healthcare Portal",
      client: "MedPulse Health",
      category: "Custom Software",
      summary: "HIPAA-compliant patient portal featuring appointment scheduling, telemetry tracking, and encrypted records.",
      technologies: ["React", "Node.js", "MongoDB", "TypeScript"],
      metrics: [
        { label: "Security Compliance", value: "100%" },
        { label: "Patient Adoption", value: "85%" },
        { label: "API Latency", value: "<120ms" },
      ],
    },
  ],

  pricing: {
    overview:
      "Olinethra provides predictable, milestone-based pricing and sprint-based engagements. Exact project costs depend on scope, complexity, third-party integrations, and timeline.",
    models: [
      {
        name: "Startup Sprint",
        tagline: "For early-stage startups needing rapid MVP execution",
        target: "Early-stage startups & MVPs",
        pricingType: "Custom Scope / Fixed Milestone",
        features: [
          "Next.js App Router Architecture",
          "Tailwind & shadcn/ui Component Library",
          "Core API & Database Setup",
          "SEO & Mobile Responsiveness",
          "Vercel Deployment & SSL",
        ],
      },
      {
        name: "Full Product Engineering",
        tagline: "Comprehensive web application design & full-stack development",
        target: "Growth-stage companies & complex platforms",
        pricingType: "Fixed Sprint / Project Retainer",
        features: [
          "Custom Figma UI/UX Design System",
          "Full-Stack Next.js + Node/PostgreSQL",
          "Role-Based Auth & Permissions",
          "Stripe / Payment Gateway Integration",
          "Automated Testing & 99+ Web Vitals",
          "Post-Launch Maintenance Support",
        ],
      },
      {
        name: "Enterprise & Dedicated Support",
        tagline: "Dedicated engineering staff, SLA maintenance & optimization",
        target: "Established companies & scale-ups",
        pricingType: "Monthly Engineering Retainer",
        features: [
          "Dedicated Full-Stack & UI Team",
          "CI/CD & DevOps Management",
          "Performance Audits & Core Vitals Monitoring",
          "Priority SLA Response Time",
          "Continuous Code Refactoring",
        ],
      },
    ],
    factors: [
      "Project Scope & Custom Feature Complexity",
      "UI/UX Design Requirements (Custom Figma Design System vs Existing Wireframes)",
      "Database & Third-Party API Integrations (Payments, CRMs, Authentication)",
      "Deployment Timeline & Delivery Urgency",
    ],
    timelines:
      "Marketing websites take 3-5 weeks. MVPs & full web applications take 6-12 weeks from discovery to final production launch.",
  },

  faqs: [
    {
      question: "What services does Olinethra provide?",
      answer:
        "Olinethra provides full-stack web development, custom Next.js web applications, UI/UX design systems, e-commerce storefront engineering, custom enterprise dashboards, and ongoing technical maintenance.",
      category: "Services",
    },
    {
      question: "How much does a website cost?",
      answer:
        "Project costs depend on your required features, complexity, and scope. Simple marketing websites range from fixed milestone pricing, while full-stack web applications and custom software are quoted after a quick technical discovery call. Contact us at hello@olinethra.com for a custom quote!",
      category: "Pricing",
    },
    {
      question: "What technologies do you use?",
      answer:
        "We build primarily with Next.js (App Router), React 19, TypeScript, Tailwind CSS, and shadcn/ui on the frontend. On the backend, we use Node.js, Express, PostgreSQL, MongoDB, Prisma, REST APIs, and Vercel cloud hosting.",
      category: "Technology",
    },
    {
      question: "How does your development process work?",
      answer:
        "We follow a 6-phase engineering process: 1. Discovery & Scoping, 2. UI/UX & Wireframing, 3. Agile TypeScript Development, 4. Quality Assurance & Performance Testing, 5. Cloud Deployment, and 6. Post-Launch SLA Support.",
      category: "Process",
    },
    {
      question: "How long does a project take?",
      answer:
        "Marketing websites take around 3 to 5 weeks. MVPs, e-commerce storefronts, and full custom web applications typically take 6 to 12 weeks from kickoff to production launch.",
      category: "Process",
    },
    {
      question: "Can you build custom web applications?",
      answer:
        "Yes! We specialize in custom SaaS applications, real-time analytics dashboards, headless e-commerce, and enterprise software built with Next.js and TypeScript.",
      category: "Services",
    },
    {
      question: "How can I start a project?",
      answer:
        "You can start a project by filling out our project inquiry form on our Contact page or emailing us directly at hello@olinethra.com. Our engineering lead will respond within 1 business day!",
      category: "Company",
    },
  ],
}

/**
 * Intelligent Knowledge Base Search & Matcher engine.
 * Used by backend API or fallback matcher to provide accurate, non-hallucinated answers.
 */
export function queryKnowledgeBase(userQuery: string): {
  answer: string
  suggestedAction?: { text: string; href: string }
  relevantCategory?: string
} {
  const query = userQuery.toLowerCase().trim()

  // 1. Direct FAQ / Suggestion Matchers
  if (query.includes("start a project") || query.includes("hire") || query.includes("get started") || query.includes("contact") || query.includes("reach out")) {
    return {
      answer:
        "We would love to help bring your project to life! You can start a project by filling out our short project form or emailing our engineering team at hello@olinethra.com.",
      suggestedAction: {
        text: "Let's discuss your project →",
        href: "/contact",
      },
      relevantCategory: "Contact",
    }
  }

  if (query.includes("cost") || query.includes("price") || query.includes("pricing") || query.includes("how much")) {
    return {
      answer:
        "Olinethra offers transparent, milestone-based pricing tailored to your technical requirements. We offer three primary models: Startup Sprint (for rapid MVPs), Full Product Engineering (for scalable web apps), and Enterprise Retainers (for dedicated staff & SLA support). Project timelines range from 3-5 weeks for websites to 6-12 weeks for complex software applications.",
      suggestedAction: {
        text: "View Pricing & Engagement Models →",
        href: "/pricing",
      },
      relevantCategory: "Pricing",
    }
  }

  if (query.includes("service") || query.includes("what do you do") || query.includes("capabilities") || query.includes("offer")) {
    return {
      answer:
        "Olinethra provides 6 core technical capabilities:\n1. Web Development (Next.js & React)\n2. UI/UX Design Systems (Figma & Prototypes)\n3. Full-Stack Engineering (Node, APIs, PostgreSQL, MongoDB)\n4. Headless E-Commerce Development (Stripe)\n5. Custom Software & Dashboards\n6. Performance Optimization & SLA Maintenance.",
      suggestedAction: {
        text: "Explore Technical Services →",
        href: "/services",
      },
      relevantCategory: "Services",
    }
  }

  if (query.includes("tech") || query.includes("stack") || query.includes("framework") || query.includes("language") || query.includes("next") || query.includes("react")) {
    return {
      answer:
        "Our primary technology stack focuses on modern, type-safe open source frameworks:\n• Frontend: Next.js (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui\n• Backend & Database: Node.js, Express, PostgreSQL, MongoDB, Prisma ORM, REST APIs\n• Infrastructure: Vercel Cloud, GitHub CI/CD, AWS.",
      suggestedAction: {
        text: "View Full Engineering Stack →",
        href: "/technologies",
      },
      relevantCategory: "Technology",
    }
  }

  if (query.includes("process") || query.includes("workflow") || query.includes("how do you work") || query.includes("step")) {
    return {
      answer:
        "Our development workflow follows 6 structured phases: 01. Discovery & Architecture Scope, 02. UI/UX Figma Design, 03. Agile TypeScript Development, 04. QA & Web Vitals Testing, 05. Cloud Deployment, and 06. SLA Maintenance & Support.",
      suggestedAction: {
        text: "See Our 6-Phase Process →",
        href: "/services#process",
      },
      relevantCategory: "Process",
    }
  }

  if (query.includes("project") || query.includes("work") || query.includes("portfolio") || query.includes("case stud") || query.includes("previous")) {
    return {
      answer:
        "We have engineered fintech SaaS platforms (Finova), headless e-commerce storefronts (Aura Apparel), and HIPAA-compliant healthcare portals (MedPulse Health). All our projects achieve 99+ Core Web Vitals and sub-second load times.",
      suggestedAction: {
        text: "Explore Client Case Studies →",
        href: "/projects",
      },
      relevantCategory: "Projects",
    }
  }

  if (query.includes("how long") || query.includes("time") || query.includes("duration") || query.includes("deadline")) {
    return {
      answer:
        "Project delivery timelines depend on scope:\n• Modern Company Websites & Marketing Platforms: 3 to 5 weeks.\n• MVPs, E-Commerce Stores & Full-Stack Web Apps: 6 to 12 weeks from kickoff to production launch.",
      suggestedAction: {
        text: "Talk to Engineering Lead →",
        href: "/contact",
      },
      relevantCategory: "Process",
    }
  }

  if (query.includes("internship") || query.includes("career") || query.includes("job") || query.includes("hiring") || query.includes("apply")) {
    return {
      answer:
        "We offer remote internships across Frontend, Backend, Full-Stack Engineering, and UI/UX Design. You can learn more in our Careers section or apply directly by emailing careers@olinethra.com.",
      suggestedAction: {
        text: "Explore Open Careers →",
        href: "/careers",
      },
      relevantCategory: "Careers",
    }
  }

  if (query.includes("who is") || query.includes("what is olinethra") || query.includes("about") || query.includes("company")) {
    return {
      answer:
        "Olinethra is an engineering-first full-stack web development studio based in San Francisco with a global remote team. We engineer production-grade web applications, custom software, and modern digital platforms with 100% source code and IP ownership transfer.",
      suggestedAction: {
        text: "About Olinethra →",
        href: "/about",
      },
      relevantCategory: "Company",
    }
  }

  // 2. Fallback for unrecognized questions
  return {
    answer:
      "I'm here to assist with information about Olinethra's software engineering services, tech stack, pricing models, process, and case studies. For specific project quotes or custom inquiries, our engineering leads are happy to assist you directly!",
    suggestedAction: {
      text: "Let's discuss your project →",
      href: "/contact",
    },
  }
}
