import type { Metadata } from "next";
import { Suspense } from "react";

import { CtaBand } from "@/components/home/cta-band";
import {
  featuredProjects,
  journalEntries,
  serviceGroups,
  testimonials,
} from "@/components/home/content";
import { FaqList } from "@/components/home/faq-list";
import { FeaturedWork } from "@/components/home/featured-work";
import { Hero } from "@/components/home/hero";
import { JournalPreview } from "@/components/home/journal-preview";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { ProcessMethod } from "@/components/home/process-method";
import { ServicesPreview } from "@/components/home/services-preview";
import { StudioCredibility } from "@/components/home/studio-credibility";
import { Testimonials } from "@/components/home/testimonials";
import { TrustStrip } from "@/components/home/trust-strip";
import { getHomePageContent } from "@/lib/content/home";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "Editorial product, brand, and content design for growing businesses in the Canary Islands and beyond.",
  title: "Scalzo Studio",
};

async function HomeCmsSections() {
  const homePageContent = await getHomePageContent();

  return (
    <>
      <FeaturedWork projects={homePageContent.featuredProjects} />
      <ServicesPreview services={homePageContent.serviceGroups} />
      <JournalPreview entries={homePageContent.journalEntries} />
      <Testimonials items={homePageContent.testimonials} />
    </>
  );
}

function HomeCmsSectionsFallback() {
  return (
    <>
      <FeaturedWork projects={featuredProjects} />
      <ServicesPreview services={serviceGroups} />
      <JournalPreview entries={journalEntries} />
      <Testimonials items={testimonials} />
    </>
  );
}

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
