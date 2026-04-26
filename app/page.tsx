import { aboutContent, contactContent, experienceContent, homeHero, marqueeItems, serviceContent } from "@/content/pages/home";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { ServicesSection } from "@/components/sections/ServicesSection";

export default function HomePage() {
  return (
    <>
      <HeroSection content={homeHero} />
      <MarqueeSection items={marqueeItems} />
      <AboutSection content={aboutContent} />
      <ServicesSection content={serviceContent} />
      <ExperienceSection content={experienceContent} />
      <ContactSection content={contactContent} />
    </>
  );
}
