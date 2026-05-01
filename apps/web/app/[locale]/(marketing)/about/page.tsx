import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { aboutPageContent } from "@/constants/about/content";
import { AboutCapabilitiesSection } from "@/components/about/about-capabilities-section";
import { AboutHeroSection } from "@/components/about/about-hero-section";
import { AboutProofSection } from "@/components/about/about-proof-section";
import { AboutStorySection } from "@/components/about/about-story-section";
import { AboutWorkingModelSection } from "@/components/about/about-working-model-section";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";
import { MarketingPageProps } from "@/interfaces/home/content";

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "about");
}

export default async function AboutPage({ params }: MarketingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

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
