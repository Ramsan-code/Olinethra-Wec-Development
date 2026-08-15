export interface TechCategory {
  category: string;
  items: {
    name: string;
    description: string;
    level: "Core" | "Advanced" | "Standard";
    icon: string;
  }[];
}

export const technologiesData: TechCategory[] = [
  {
    category: "Frontend Architecture",
    items: [
      { name: "Next.js", description: "Latest App Router with Server Components & SSR", level: "Core", icon: "Globe" },
      { name: "React", description: "Modern functional React with hooks & concurrent mode", level: "Core", icon: "Code" },
      { name: "TypeScript", description: "Strict type safety across client and server logic", level: "Core", icon: "FileCode" },
      { name: "Tailwind CSS", description: "Utility-first CSS architecture for custom responsive UI", level: "Core", icon: "Palette" },
      { name: "shadcn/ui", description: "Accessible headless UI components built on Radix primitives", level: "Core", icon: "Layers" }
    ]
  },
  {
    category: "Backend & Databases",
    items: [
      { name: "Node.js", description: "High-performance runtime for asynchronous backend APIs", level: "Core", icon: "Server" },
      { name: "Express", description: "Minimalist web framework for robust REST endpoints", level: "Standard", icon: "Cpu" },
      { name: "PostgreSQL", description: "Relational database engine with ACID compliance", level: "Core", icon: "Database" },
      { name: "MongoDB", description: "Document-oriented NoSQL store for flexible schemas", level: "Standard", icon: "HardDrive" },
      { name: "Prisma ORM", description: "Type-safe database client and automated migration tooling", level: "Advanced", icon: "Terminal" }
    ]
  },
  {
    category: "DevOps & Tooling",
    items: [
      { name: "Vercel", description: "Global edge network & CI/CD deployment platform", level: "Core", icon: "Cloud" },
      { name: "Git & GitHub", description: "Distributed version control and pull request code reviews", level: "Core", icon: "GitBranch" },
      { name: "Figma", description: "Collaborative interface design & visual prototyping", level: "Core", icon: "Figma" },
      { name: "ESLint & Prettier", description: "Automated code formatting and static analysis rules", level: "Core", icon: "CheckCircle2" }
    ]
  }
];
