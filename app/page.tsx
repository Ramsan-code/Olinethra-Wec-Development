import Navbar from "@/components/layout/Navbar"
import HeroSection from "@/components/sections/HeroSection"
import AboutSection from "@/components/sections/AboutSection"
import ServicesSection from "@/components/sections/ServicesSection"
import TechnologiesSection from "@/components/sections/TechnologiesSection"
import ProjectsSection from "@/components/sections/ProjectsSection"
import ProcessSection from "@/components/sections/ProcessSection"
import TeamSection from "@/components/sections/TeamSection"
import CareersSection from "@/components/sections/CareersSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import FAQSection from "@/components/sections/FAQSection"
import ContactSection from "@/components/sections/ContactSection"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TechnologiesSection />
        <ProjectsSection />
        <ProcessSection />
        <TeamSection />
        <CareersSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}