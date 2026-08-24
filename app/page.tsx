import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import HeroSection from "@/components/sections/HeroSection"
import AboutSection from "@/components/sections/AboutSection"
import ServicesSection from "@/components/sections/ServicesSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import InsightsSection from "@/components/sections/InsightsSection"
import PlaygroundSection from "@/components/sections/PlaygroundSection"
import FinalCtaSection from "@/components/sections/FinalCtaSection"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Olinethra | Engineering-First Web Development Studio",
  description: "Olinethra designs, architect, and engineers production-grade web applications, modern websites, and digital systems built for performance and scale.",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection isHomepage />
        <ProjectsSection isHomepage />
        <AboutSection />
        <InsightsSection />
        <PlaygroundSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  )
}