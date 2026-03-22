import { CtaBand } from "@/components/home/cta-band";
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

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedWork />
      <ServicesPreview />
      <JournalPreview />
      <ProcessMethod />
      <StudioCredibility />
      <Testimonials />
      <FaqList />
      <NewsletterSignup />
      <CtaBand />
    </>
  );
}
