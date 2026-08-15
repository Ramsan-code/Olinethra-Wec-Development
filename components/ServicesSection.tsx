"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const services = [
  {
    title: "Market Analysis",
    description:
      "Comprehensive market research and competitor analysis to identify growth opportunities.",
  },
  {
    title: "Business Analysis",
    description:
      "Data-driven business insights and strategic planning for sustainable success.",
  },
  {
    title: "Logo Design",
    description:
      "Professional branding and logo creation that reflects your business identity.",
  },
  {
    title: "AI Solutions",
    description:
      "Custom AI-powered tools and automation solutions for modern businesses.",
  },
  {
    title: "Web Development",
    description:
      "Responsive, scalable, and high-performance websites and web applications.",
  },
  {
    title: "Research & Development",
    description:
      "Innovative R&D services to transform ideas into impactful solutions.",
  },
  {
    title: "Content Creation",
    description:
      "High-quality content creation and content marketing strategies for engagement.",
  },
  {
    title: "Digital Marketing",
    description:
      "SEO, social media marketing, PPC campaigns, and online brand growth.",
  },
  {
    title: "AI Video Generation",
    description:
      "Create engaging AI-generated videos for marketing, education, and branding.",
  },
  {
    title: "AI Consulting",
    description:
      "Expert guidance for implementing AI technologies within your organization.",
  },
  {
    title: "Education Courses",
    description:
      "Professional training programs in technology, AI, marketing, and business.",
  },
  {
    title: "Quality Assurance",
    description:
      "Comprehensive software testing and QA services to ensure product excellence.",
  },
];

export default function ServicesSection() {
  useEffect(() => {
    const cards = document.querySelectorAll(".spotlight-card");

    const handleMouseMove = (ev: MouseEvent) => {
      cards.forEach((card) => {
        const blob = card.querySelector(".blob") as HTMLElement;
        const fakeBlob = card.querySelector(".fake-blob") as HTMLElement;

        if (!blob || !fakeBlob) return;

        const rect = fakeBlob.getBoundingClientRect();

        blob.style.opacity = "1";

        blob.animate(
          [
            {
              transform: `translate(
                ${ev.clientX - rect.left - rect.width / 2}px,
                ${ev.clientY - rect.top - rect.height / 2}px
              )`,
            },
          ],
          {
            duration: 300,
            fill: "forwards",
          }
        );
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <main className="flex-1">
    <section className="bg-slate-50 py-45">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Our Services
          </h2>

          <p className="mt-4 text-slate-600">
            Innovative digital solutions tailored for modern businesses.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="spotlight-card group relative overflow-hidden rounded-xl p-px"
            >
              <Card className="relative h-full border-0 bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-slate-600">
                    {service.description}
                  </p>
                </CardContent>
              </Card>

              <div className="blob absolute left-0 top-0 h-24 w-24 rounded-full bg-blue-500/40 opacity-0 blur-3xl transition-all duration-300" />

              <div className="fake-blob absolute left-0 top-0 h-24 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
    </main>
  );
}