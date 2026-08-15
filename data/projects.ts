export interface ProjectItem {
  id: string;
  title: string;
  category: "E-Commerce" | "SaaS Dashboard" | "Business Management" | "Web Application" | "Marketplace";
  client: string;
  year: string;
  summary: string;
  description: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  featured: boolean;
  imagePlaceholder: {
    title: string;
    subtitle: string;
    codeSnippet: string;
  };
}

export const projectsData: ProjectItem[] = [
  {
    id: "nexus-ecommerce",
    title: "Nexus Global E-Commerce",
    category: "E-Commerce",
    client: "Nexus Brands Group",
    year: "2025",
    summary: "Headless e-commerce storefront engineered for ultra-fast checkout and international multi-currency transactions.",
    description: "Designed and built a headless e-commerce architecture utilizing Next.js, Stripe, and modern serverless API endpoints. Features instant page transitions, sub-second search filtering, multi-currency localization, and a bespoke admin dashboard for order fulfillment.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe API", "PostgreSQL", "Vercel"],
    metrics: [
      { label: "Page Load Speed", value: "< 0.4s" },
      { label: "Conversion Lift", value: "+38%" },
      { label: "Core Web Vitals", value: "99/100" }
    ],
    featured: true,
    imagePlaceholder: {
      title: "NEXUS STOREFRONT",
      subtitle: "Headless E-Commerce Architecture",
      codeSnippet: "const checkout = await nexusApi.initiateSession({ currency: 'USD' });"
    }
  },
  {
    id: "strata-saas-dashboard",
    title: "Strata Analytics Platform",
    category: "SaaS Dashboard",
    client: "Strata Cloud Intelligence",
    year: "2025",
    summary: "Enterprise data visualization and real-time operational dashboard for cloud infrastructure monitoring.",
    description: "An intuitive SaaS monitoring platform that turns complex server telemetry into actionable charts and real-time alerts. Implemented high-throughput data streams, interactive customizable widgets, and fine-grained user permission controls.",
    technologies: ["React", "TypeScript", "Recharts", "Node.js", "Express", "Tailwind CSS"],
    metrics: [
      { label: "Telemetry Ingestion", value: "10k/sec" },
      { label: "User Engagement", value: "+64%" },
      { label: "Uptime", value: "99.99%" }
    ],
    featured: true,
    imagePlaceholder: {
      title: "STRATA MONITOR",
      subtitle: "Enterprise Real-Time Analytics",
      codeSnippet: "subscribeTelemetry((data) => updateMetricsState(data));"
    }
  },
  {
    id: "vanguard-bms",
    title: "Vanguard Enterprise Resource Manager",
    category: "Business Management",
    client: "Vanguard Logistics",
    year: "2025",
    summary: "Integrated business management portal streamlining supply chain, inventory, and automated invoicing.",
    description: "Unified logistics platform built for internal staff and client portals. Replaced fragmented legacy spreadsheets with a cohesive dashboard for real-time tracking, automated PDF invoice generation, and role-based staff authorization.",
    technologies: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS", "shadcn/ui"],
    metrics: [
      { label: "Processing Overhead", value: "-45%" },
      { label: "Active Operations", value: "120k/mo" },
      { label: "Accuracy Rate", value: "99.8%" }
    ],
    featured: true,
    imagePlaceholder: {
      title: "VANGUARD ERP",
      subtitle: "Unified Logistics System",
      codeSnippet: "await vanguard.dispatchShipment({ trackingId: 'VNG-9812' });"
    }
  },
  {
    id: "aperture-booking",
    title: "Aperture Studio Reservations",
    category: "Web Application",
    client: "Aperture Creative Studios",
    year: "2024",
    summary: "High-end studio booking and resource scheduling portal with real-time calendar synchronization.",
    description: "A sleek reservation application enabling visual studio space booking, equipment rental add-ons, calendar integration, and automated SMS/Email reminders for creative professionals.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    metrics: [
      { label: "Direct Bookings", value: "+82%" },
      { label: "Schedule Conflicts", value: "0%" },
      { label: "Customer Rating", value: "4.9/5" }
    ],
    featured: false,
    imagePlaceholder: {
      title: "APERTURE BOOKING",
      subtitle: "Resource & Studio Reservations",
      codeSnippet: "const slot = await calendar.reserveTimeSlot(selectedTime);"
    }
  },
  {
    id: "omni-marketplace",
    title: "Omni Digital Asset Exchange",
    category: "Marketplace",
    client: "Omni Media Collective",
    year: "2024",
    summary: "Digital marketplace connecting independent creators with enterprise license buyers.",
    description: "A secure digital distribution marketplace supporting instant digital product previews, licensing agreements, automatic payouts, and structured metadata searching.",
    technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS"],
    metrics: [
      { label: "Monthly Volume", value: "$1.4M" },
      { label: "Search Speed", value: "85ms" },
      { label: "Seller Onboarding", value: "3 mins" }
    ],
    featured: false,
    imagePlaceholder: {
      title: "OMNI MARKETPLACE",
      subtitle: "Digital Licensing Exchange",
      codeSnippet: "const license = await omni.verifyLicenseKey(assetId, key);"
    }
  },
  {
    id: "horizon-company-site",
    title: "Horizon Quantum Technologies",
    category: "Web Application",
    client: "Horizon Quantum Labs",
    year: "2024",
    summary: "Editorial corporate website for a deep-tech quantum computing research organization.",
    description: "A minimalist, high-contrast digital presence engineered to communicate complex research breakthroughs clearly. Built with crisp editorial typography, interactive research paper previews, and dynamic press releases.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX", "Vercel"],
    metrics: [
      { label: "Organic Traffic", value: "+210%" },
      { label: "Bounce Rate", value: "24%" },
      { label: "Lighthouse Rating", value: "100/100" }
    ],
    featured: false,
    imagePlaceholder: {
      title: "HORIZON LABS",
      subtitle: "Deep-Tech Editorial Web Presence",
      codeSnippet: "export const metadata = { title: 'Horizon Quantum Research' };"
    }
  }
];
