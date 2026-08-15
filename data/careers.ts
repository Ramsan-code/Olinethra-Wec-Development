export interface CareerPosition {
  id: string;
  title: string;
  type: "Internship" | "Full-Time" | "Contract";
  location: "Remote" | "Hybrid (San Francisco, CA)" | "On-Site";
  experienceLevel: "Entry / Internship" | "Junior" | "Mid-Level";
  department: "Engineering" | "Design" | "Quality Assurance";
  shortDesc: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applyEmail: string;
}

export const careersData: CareerPosition[] = [
  {
    id: "frontend-developer-intern",
    title: "Frontend Developer Intern",
    type: "Internship",
    location: "Remote",
    experienceLevel: "Entry / Internship",
    department: "Engineering",
    shortDesc: "Work alongside senior engineers building high-performance Next.js and React components using TypeScript and Tailwind CSS.",
    description: "As a Frontend Developer Intern at Olinethra, you will participate directly in active client web projects. You'll craft accessible UI components, implement responsive web design patterns, and learn industry standards in web performance.",
    responsibilities: [
      "Build modular React components following our design system rules",
      "Translate Figma wireframes into clean, semantic HTML/CSS code",
      "Collaborate with backend engineers to integrate API endpoints",
      "Participate in code reviews and performance profiling"
    ],
    requirements: [
      "Solid understanding of JavaScript (ES6+), React fundamentals, and CSS grid/flexbox",
      "Familiarity with TypeScript and Tailwind CSS",
      "Understanding of Git branching workflows",
      "Eagerness to learn production Next.js App Router patterns"
    ],
    benefits: [
      "Mentorship from experienced senior full-stack developers",
      "Hands-on experience on real production projects",
      "Flexible remote working hours",
      "Certificate of completion & potential full-time offer conversion"
    ],
    applyEmail: "careers@olinethra.com"
  },
  {
    id: "backend-developer-intern",
    title: "Backend Developer Intern",
    type: "Internship",
    location: "Remote",
    experienceLevel: "Entry / Internship",
    department: "Engineering",
    shortDesc: "Gain hands-on experience building RESTful APIs, serverless functions, and managing relational and NoSQL databases.",
    description: "Join our core engineering team to develop scale-ready backend API services using Node.js, Express, PostgreSQL, and MongoDB. Learn database optimization, authentication flows, and automated testing.",
    responsibilities: [
      "Develop and document clean REST and GraphQL API routes",
      "Write efficient database queries in PostgreSQL and MongoDB",
      "Assist in writing unit and integration tests",
      "Help optimize server response times and database indexing"
    ],
    requirements: [
      "Understanding of Node.js asynchronous programming and API concepts",
      "Basic experience with SQL (PostgreSQL) or MongoDB",
      "Familiarity with REST architecture principles",
      "Knowledge of Git version control"
    ],
    benefits: [
      "Direct code mentorship and architectural guidance",
      "Real-world experience with database scaling and serverless APIs",
      "Flexible schedule and fully remote workspace",
      "Potential conversion to full-time junior position"
    ],
    applyEmail: "careers@olinethra.com"
  },
  {
    id: "ui-ux-design-intern",
    title: "UI/UX Design Intern",
    type: "Internship",
    location: "Remote",
    experienceLevel: "Entry / Internship",
    department: "Design",
    shortDesc: "Craft minimal, editorial user interfaces and help maintain comprehensive design systems in Figma.",
    description: "Collaborate with our design director to create elegant digital experiences. You will design wireframes, high-fidelity mockups, design token systems, and interactive prototypes for client projects.",
    responsibilities: [
      "Create high-fidelity UI layouts in Figma adhering to strict typography grid standards",
      "Build reusable component libraries and design tokens",
      "Conduct user workflow research and competitive UI analyses",
      "Assist frontend developers during design handoff and implementation QA"
    ],
    requirements: [
      "Strong portfolio demonstrating layout, visual hierarchy, and typography",
      "Proficiency in Figma (auto-layout, components, variants)",
      "Understanding of responsive design principles and web constraints",
      "Attention to micro-details and clean visual aesthetic"
    ],
    benefits: [
      "Design portfolio building with real production client work",
      "Direct mentorship from senior UI/UX design leads",
      "Flexible remote environment",
      "Full-time hiring track based on performance"
    ],
    applyEmail: "careers@olinethra.com"
  },
  {
    id: "full-stack-developer-intern",
    title: "Full-Stack Developer Intern",
    type: "Internship",
    location: "Remote",
    experienceLevel: "Entry / Internship",
    department: "Engineering",
    shortDesc: "End-to-end web engineering role spanning frontend Next.js interfaces and backend Node.js APIs.",
    description: "Build complete end-to-end features for custom web applications. Work across the entire software stack—from frontend UI component implementation to backend database schema migrations.",
    responsibilities: [
      "Implement full-stack features from specification to deployment",
      "Integrate state management, form validation, and server endpoints",
      "Write clean, modular code with TypeScript across client and server",
      "Participate in daily engineering standups and sprint planning"
    ],
    requirements: [
      "Experience building small full-stack projects using React and Node.js",
      "Familiarity with TypeScript and database fundamentals",
      "Basic knowledge of Next.js or express backend servers",
      "Strong problem-solving skills and self-motivation"
    ],
    benefits: [
      "Comprehensive full-stack engineering mentorship",
      "Exposure to modern CI/CD, Vercel deployments, and database ORMs",
      "Remote work flexibility",
      "Priority consideration for permanent roles"
    ],
    applyEmail: "careers@olinethra.com"
  }
];
