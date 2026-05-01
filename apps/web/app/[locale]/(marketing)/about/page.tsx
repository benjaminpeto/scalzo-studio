import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { getAboutPublicContent } from "@/constants/about/public-content";
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
  const content = getAboutPublicContent(locale);

  return (
    <>
      <AboutHeroSection locale={locale} />
      <AboutStorySection locale={locale} />
      <AboutCapabilitiesSection locale={locale} />
      <AboutWorkingModelSection locale={locale} />
      <AboutProofSection locale={locale} />
      <MarketingCtaBand
        id="contact"
        briefItems={content.cta.briefItems}
        briefKicker={content.cta.briefKicker}
        className="pb-24"
        description={content.cta.description}
        email={{
          href: "mailto:hello@scalzostudio.com",
          label: "hello@scalzostudio.com",
        }}
        kicker={content.cta.kicker}
        primaryAction={{
          href: "/contact#booking",
          label: content.cta.primaryActionLabel,
        }}
        secondaryAction={{
          href: "/services",
          label: content.cta.secondaryActionLabel,
        }}
        title={content.cta.title}
      />
    </>
  );
}
