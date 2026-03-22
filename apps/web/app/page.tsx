import { CtaBand } from "@/components/home/cta-band";
import { FaqList } from "@/components/home/faq-list";
import { FeaturedWork } from "@/components/home/featured-work";
import { Hero } from "@/components/home/hero";
import { JournalPreview } from "@/components/home/journal-preview";
import { MobileCtaBar } from "@/components/home/mobile-cta-bar";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { ProcessMethod } from "@/components/home/process-method";
import { ServicesPreview } from "@/components/home/services-preview";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { StudioCredibility } from "@/components/home/studio-credibility";
import { TrustStrip } from "@/components/home/trust-strip";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <TrustStrip />
        <FeaturedWork />
        <ServicesPreview />
        <JournalPreview />
        <ProcessMethod />
        <StudioCredibility />
        <FaqList />
        <NewsletterSignup />
        <CtaBand />
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </>
  );
}
