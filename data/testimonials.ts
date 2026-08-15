export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  companyName: string;
  projectScope: string;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: "nexus-quote",
    quote: "Olinethra delivered a headless store that cut our page load times in half and noticeably improved our checkout conversion rate. Their technical clarity and focus on clean architecture made the entire process painless.",
    authorName: "Sarah Jenkins",
    authorRole: "VP of Product",
    companyName: "Nexus Brands Group",
    projectScope: "E-Commerce Re-architecture"
  },
  {
    id: "strata-quote",
    quote: "The team at Olinethra transformed our complex infrastructure metrics into a crisp, responsive dashboard. Their frontend discipline with Next.js and TypeScript is exceptional.",
    authorName: "Michael Thorne",
    authorRole: "Chief Technology Officer",
    companyName: "Strata Cloud Intelligence",
    projectScope: "SaaS Monitoring Platform"
  },
  {
    id: "vanguard-quote",
    quote: "Working with Olinethra brought order to our operational workflow. They took the time to understand our domain deeply and delivered an enterprise web portal that our operational staff relies on daily.",
    authorName: "Rachel Sterling",
    authorRole: "Director of Operations",
    companyName: "Vanguard Logistics",
    projectScope: "Enterprise Management System"
  },
  {
    id: "horizon-quote",
    quote: "Olinethra's monochrome design aesthetic perfectly aligned with our deep-tech brand identity. Their work delivered high performance, flawless accessibility, and elegant typography.",
    authorName: "Dr. Aris Thorne",
    authorRole: "Head of Communications",
    companyName: "Horizon Quantum Labs",
    projectScope: "Editorial Web Platform"
  }
];
