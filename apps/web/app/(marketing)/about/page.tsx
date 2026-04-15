import { aboutPageContent } from "@/constants/about/content";
import { AboutCapabilitiesSection } from "@/components/about/about-capabilities-section";
import { AboutHeroSection } from "@/components/about/about-hero-section";
import { AboutProofSection } from "@/components/about/about-proof-section";
import { AboutStorySection } from "@/components/about/about-story-section";
import { AboutWorkingModelSection } from "@/components/about/about-working-model-section";
import { marketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";

export const metadata = marketingRouteMetadata.about;

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <AboutStorySection />
      <AboutCapabilitiesSection />
      <AboutWorkingModelSection />
      <AboutProofSection />
      <MarketingCtaBand
        id="contact"
        briefItems={aboutPageContent.cta.briefItems}
        briefKicker="First conversation"
        className="pb-24"
        description={aboutPageContent.cta.description}
        email={{
          href: "mailto:hello@scalzostudio.com",
          label: "hello@scalzostudio.com",
        }}
        kicker="Scalzo Studio"
        primaryAction={{ href: "/contact#booking", label: "Book a call" }}
        secondaryAction={{ href: "/services", label: "Browse services" }}
        title={aboutPageContent.cta.title}
      />
    </>
  );
}
