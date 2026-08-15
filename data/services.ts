export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  deliverables: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: "web-development",
    title: "Web Development",
    shortDesc: "High-performance, scalable web applications built with modern frameworks and robust architecture.",
    fullDesc: "We engineer fast, secure, and production-ready web applications using Next.js, React, and TypeScript. From dynamic SaaS portals to high-converting marketing platforms, our code is modular, well-tested, and optimized for maximum speed and SEO.",
    iconName: "Code2",
    features: [
      "Custom Next.js & React App Architecture",
      "Server-side Rendering & Static Generation",
      "API Integration & Backend Connectivity",
      "Core Web Vitals & Performance Optimization"
    ],
    deliverables: ["Production Web Application", "TypeScript Codebase", "CI/CD Pipeline Setup", "Documentation & Maintenance Guide"]
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    shortDesc: "Intuitive, user-centered interface designs crafted for high engagement and seamless navigation.",
    fullDesc: "We transform complex user workflows into clean, elegant digital interfaces. Our design process combines user research, wireframing, high-fidelity UI design, and interactive prototyping to ensure every interaction feels natural and rewarding.",
    iconName: "Layout",
    features: [
      "Design Systems & Component Libraries",
      "Wireframing & Interactive Prototyping",
      "User Journey & Workflow Mapping",
      "Responsive Layouts for Mobile & Desktop"
    ],
    deliverables: ["Figma Design Files", "Interactive Prototypes", "Design Tokens & Style Guides", "Asset Libraries"]
  },
  {
    id: "full-stack-development",
    title: "Full-Stack Development",
    shortDesc: "End-to-end software solutions spanning modern frontends, robust APIs, and scalable databases.",
    fullDesc: "Our full-stack team builds comprehensive backend architectures paired with responsive frontend clients. We design robust database schemas, secure REST/GraphQL APIs, and cloud-native integrations built for growth.",
    iconName: "Server",
    features: [
      "RESTful API & GraphQL Development",
      "Database Architecture (PostgreSQL, MongoDB)",
      "Authentication & Role-Based Access",
      "Cloud Infrastructure & Serverless Deployments"
    ],
    deliverables: ["Full-Stack Application", "API Specification", "Database Schema", "Security Audit Report"]
  },
  {
    id: "e-commerce-development",
    title: "E-Commerce Development",
    shortDesc: "Custom online store platforms optimized for conversion, security, and lightning-fast checkout.",
    fullDesc: "We design and build bespoke e-commerce experiences tailored to modern brands. By prioritizing fast load times, frictionless checkout flows, and inventory integration, we empower businesses to drive conversion and scale online sales.",
    iconName: "ShoppingBag",
    features: [
      "Headless E-Commerce Solutions",
      "Payment Gateway Integration (Stripe, PayPal)",
      "Product Catalog & Cart Management",
      "Order Processing & Inventory Sync"
    ],
    deliverables: ["Custom E-Commerce Store", "Payment Gateway Setup", "CMS & Product Management", "Analytics Integration"]
  },
  {
    id: "custom-software",
    title: "Custom Software Solutions",
    shortDesc: "Tailored business software, internal dashboards, and workflow automation tools.",
    fullDesc: "Every organization has unique operational requirements. We build bespoke software applications—from internal admin dashboards and CRM tools to automated reporting pipelines—that streamline operations and reduce overhead.",
    iconName: "Cpu",
    features: [
      "Internal Business Dashboards",
      "Workflow & Process Automation",
      "Third-Party API Integrations",
      "Custom Data Visualization & Analytics"
    ],
    deliverables: ["Custom Software Suite", "Role Access Management", "Integration Suite", "Staff Training & Docs"]
  },
  {
    id: "maintenance-optimization",
    title: "Maintenance & Optimization",
    shortDesc: "Ongoing technical support, performance tuning, security updates, and infrastructure scaling.",
    fullDesc: "Building software is only the first step. We provide continuous support, proactive monitoring, security patch management, and performance optimization to ensure your digital platform remains secure, stable, and blazingly fast.",
    iconName: "Zap",
    features: [
      "Performance Audits & Core Web Vitals Fixes",
      "Security Patching & Dependency Updates",
      "Infrastructure Monitoring & Error Tracking",
      "Feature Enhancements & Code Refactoring"
    ],
    deliverables: ["Monthly Performance Reports", "Priority Tech Support", "Security Compliance Audits", "SLAs & Uptime Guarantee"]
  }
];
