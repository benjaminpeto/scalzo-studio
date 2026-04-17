import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CtaBand } from "@/components/home/cta-band";
import { FaqList } from "@/components/home/faq-list";
import { Hero } from "@/components/home/hero";
import { HomeCmsSections } from "@/components/home/home-cms-sections";
import { HomeCmsSectionsFallback } from "@/components/home/home-cms-sections-fallback";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { ProcessMethod } from "@/components/home/process-method";
import { StudioCredibility } from "@/components/home/studio-credibility";
import { TrustStrip } from "@/components/home/trust-strip";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "home");
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustStrip />
      <Suspense fallback={<HomeCmsSectionsFallback />}>
        <HomeCmsSections />
      </Suspense>
      <ProcessMethod />
      <StudioCredibility />
      <FaqList />
      <NewsletterSignup placement="home" />
      <CtaBand />
    </>
  );
}
