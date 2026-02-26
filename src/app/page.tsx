import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ProjectFeed } from "@/components/landing/project-feed";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StackSection } from "@/components/landing/stack-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ProjectFeed />
      <FeaturesSection />
      <HowItWorks />
      <StackSection />
      <CtaSection />
      <Footer />
    </>
  );
}
