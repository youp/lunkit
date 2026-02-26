import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { ProjectFeed } from "@/components/landing/project-feed";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StackSection } from "@/components/landing/stack-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lunkit",
  url: "https://lunkit.vercel.app",
  description:
    "사이드 프로젝트를 등록하고 동료 개발자에게 피드백을 받는 쇼케이스 플랫폼",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
