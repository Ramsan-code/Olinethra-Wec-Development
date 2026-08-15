export interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  keyActivities: string[];
}

export const processData: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    tagline: "Architecture & Requirement Mapping",
    description: "We initiate every project with a thorough discovery phase, analyzing technical requirements, business targets, and target audience needs.",
    keyActivities: ["Technical Scope Definition", "Competitor & Market Research", "Architecture Blueprinting", "Project Roadmap Creation"]
  },
  {
    number: "02",
    title: "Plan",
    tagline: "Sprint Structure & Data Modeling",
    description: "We translate project requirements into structured development sprints, wireframes, and data schemas to eliminate ambiguity.",
    keyActivities: ["Database Schema Design", "API Endpoint Specs", "Sprint Breakdown", "Resource Allocation"]
  },
  {
    number: "03",
    title: "Design",
    tagline: "Monochrome UI Systems & UX Workflows",
    description: "Our design team crafts crisp visual mockups and interactive prototypes with an emphasis on clarity, visual hierarchy, and accessibility.",
    keyActivities: ["Figma High-Fidelity UI", "Design Token Configuration", "Responsive Layout Testing", "Interactive Prototypes"]
  },
  {
    number: "04",
    title: "Develop",
    tagline: "Clean Next.js & TypeScript Code",
    description: "We write clean, modular, and well-documented TypeScript code using Server Components, optimized styling, and robust API endpoints.",
    keyActivities: ["Frontend Component Construction", "Backend API Integration", "State Management Setup", "Version Control & Code Reviews"]
  },
  {
    number: "05",
    title: "Test",
    tagline: "QA, Performance & Accessibility",
    description: "Rigorous testing guarantees high performance across devices, full keyboard accessibility, zero console errors, and high Core Web Vitals scores.",
    keyActivities: ["Cross-Browser Validation", "Core Web Vitals Optimization", "Accessibility (WCAG 2.1) Audit", "Security & Load Testing"]
  },
  {
    number: "06",
    title: "Launch",
    tagline: "Deployment & Post-Launch Support",
    description: "We execute seamless production deployment to Vercel/cloud infrastructure, set up error monitoring, and provide post-launch optimization.",
    keyActivities: ["Production CI/CD Deployment", "Domain & SSL Configuration", "Analytics & Error Monitoring", "Client Handoff & Maintenance"]
  }
];
