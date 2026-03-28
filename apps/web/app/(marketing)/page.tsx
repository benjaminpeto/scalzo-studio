import type { Metadata } from "next";
import { Suspense } from "react";

import { CtaBand } from "@/components/home/cta-band";
import { FaqList } from "@/components/home/faq-list";
import { Hero } from "@/components/home/hero";
import { HomeCmsSections } from "@/components/home/home-cms-sections";
import { HomeCmsSectionsFallback } from "@/components/home/home-cms-sections-fallback";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { ProcessMethod } from "@/components/home/process-method";
import { StudioCredibility } from "@/components/home/studio-credibility";
import { TrustStrip } from "@/components/home/trust-strip";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "Editorial product, brand, and content design for growing businesses in the Canary Islands and beyond.",
  title: "Scalzo Studio",
};

export default function Home() {
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
      <NewsletterSignup />
      <CtaBand />
    </>
  );
}
