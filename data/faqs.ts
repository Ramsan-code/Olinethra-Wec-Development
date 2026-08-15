export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Services & Tech" | "Process & Timeline" | "Careers & Internships";
}

export const faqsData: FAQItem[] = [
  {
    id: "services-overview",
    question: "What core services does Olinethra provide?",
    answer: "Olinethra specializes in modern web development, custom full-stack software development, UI/UX design, e-commerce storefront engineering, internal business management dashboards, and ongoing technical optimization.",
    category: "Services & Tech"
  },
  {
    id: "tech-stack",
    question: "What technologies do you use for web applications?",
    answer: "Our primary technical stack consists of Next.js (App Router), React, TypeScript, Tailwind CSS, and shadcn/ui for frontend architecture. On the backend, we work with Node.js, Express, PostgreSQL, MongoDB, and serverless edge functions hosted on platforms like Vercel.",
    category: "Services & Tech"
  },
  {
    id: "project-timeline",
    question: "How long does a typical web application project take?",
    answer: "Timelines vary depending on project scope. A standard marketing website or company web presence takes approximately 3 to 5 weeks. Complex web applications, e-commerce platforms, or enterprise dashboards typically take 6 to 12 weeks from discovery to final deployment.",
    category: "Process & Timeline"
  },
  {
    id: "startup-pricing",
    question: "Do you work with early-stage startups and small businesses?",
    answer: "Yes. We regularly partner with early-stage startups to build Minimum Viable Products (MVPs), pitch-ready prototypes, and scalable foundational web architecture designed for rapid iteration.",
    category: "General"
  },
  {
    id: "development-process",
    question: "What is your step-by-step development process?",
    answer: "We follow a 6-phase structured workflow: 01 Discover (requirements & architecture), 02 Plan (sprints & specs), 03 Design (wireframes & Figma UI), 04 Develop (clean TypeScript code), 05 Test (QA, accessibility & performance), and 06 Launch (CI/CD deployment & monitoring).",
    category: "Process & Timeline"
  },
  {
    id: "post-launch-support",
    question: "Do you offer post-launch maintenance and technical support?",
    answer: "Yes, we provide ongoing maintenance retainer plans covering security updates, server monitoring, Core Web Vitals performance tuning, and feature extensions to keep your digital platform running at peak efficiency.",
    category: "Services & Tech"
  },
  {
    id: "internship-program",
    question: "How can students or junior developers apply for internships at Olinethra?",
    answer: "We offer remote internships across Frontend, Backend, UI/UX Design, and Full-Stack Engineering. You can explore available roles in our Careers section and send your portfolio or GitHub links directly to careers@olinethra.com.",
    category: "Careers & Internships"
  },
  {
    id: "code-ownership",
    question: "Who owns the source code and intellectual property after completion?",
    answer: "You do. Upon project completion and final payment, full ownership of all source code, design assets, and intellectual property is transferred directly to your organization.",
    category: "General"
  }
];
