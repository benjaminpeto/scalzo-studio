import Link from "next/link";
import { Suspense } from "react";

import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import { processSteps, trustMarks } from "@/components/home/content";
import { getHomeTestimonials } from "@/actions/home/get-home-testimonials";
import { getServicesIndexEntries } from "@/actions/services/get-services-index-entries";
import { aboutPageContent } from "@/constants/about/content";
import type { ServicesIndexEntry } from "@/interfaces/services/content";
import { marketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";
import { ServiceCard } from "@ui/components/marketing/service-card";
import { TestimonialCard } from "@ui/components/marketing/testimonial-card";

export const metadata = marketingRouteMetadata.about;

async function AboutCapabilitiesContent() {
  const services = await getServicesIndexEntries();

  return <AboutCapabilitiesGrid services={services} />;
}

function AboutCapabilitiesFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="h-full rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4"
        >
          <div className="h-4 w-10 rounded-full bg-black/6" />
          <div className="mt-5 h-4 w-36 rounded-full bg-black/6" />
          <div className="mt-3 h-8 w-44 rounded-[0.9rem] bg-black/8" />
          <div className="mt-5 space-y-3">
            <div className="h-4 rounded-full bg-black/7" />
            <div className="h-4 max-w-[84%] rounded-full bg-black/5" />
          </div>
          <div className="mt-7 space-y-3">
            <div className="h-4 rounded-full bg-black/7" />
            <div className="h-4 max-w-[82%] rounded-full bg-black/5" />
            <div className="h-4 max-w-[70%] rounded-full bg-black/4" />
          </div>
        </article>
      ))}
    </div>
  );
}

function AboutCapabilitiesGrid({
  services,
}: {
  services: ReadonlyArray<ServicesIndexEntry>;
}) {
  return (
    <RevealGroup className="grid gap-8 lg:grid-cols-3" stagger={0.08}>
      {services.map((service, index) => (
        <RevealItem key={service.slug}>
          <ServiceCard
            className="h-full rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4"
            cta={{
              href: `/services/${service.slug}`,
              label: "Explore service",
            }}
            description={service.summary}
            indexLabel={`0${index + 1}`}
            items={service.deliverables}
            metadata="Scalzo Studio capability"
            outcome={service.outcome}
            showMarkers={false}
            title={service.title}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

async function AboutProofContent() {
  const testimonials = await getHomeTestimonials();

  return (
    <RevealGroup
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      stagger={0.08}
    >
      {testimonials.map((testimonial) => (
        <RevealItem key={`${testimonial.name}-${testimonial.company}`}>
          <TestimonialCard
            className="h-full"
            company={testimonial.company}
            name={testimonial.name}
            quote={testimonial.quote}
            role={testimonial.role}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function AboutProofFallback() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-7"
        >
          <div className="space-y-3">
            <div className="h-8 w-40 rounded-[0.9rem] bg-black/8" />
            <div className="h-4 rounded-full bg-black/7" />
            <div className="h-4 max-w-[92%] rounded-full bg-black/5" />
            <div className="h-4 max-w-[70%] rounded-full bg-black/4" />
          </div>
          <div className="mt-7 border-t border-border/70 pt-5">
            <div className="h-4 w-28 rounded-full bg-black/7" />
            <div className="mt-2 h-4 w-44 rounded-full bg-black/5" />
          </div>
        </article>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">{aboutPageContent.hero.kicker}</p>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.5rem] lg:text-[5.9rem]">
                  {aboutPageContent.hero.title}
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                {aboutPageContent.hero.intro}
              </Prose>
              <div className="space-y-4">
                {aboutPageContent.hero.supporting.map((paragraph) => (
                  <Prose key={paragraph} measure="lg">
                    {paragraph}
                  </Prose>
                ))}
              </div>
            </Stack>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <p className="section-kicker">Studio signal</p>
              <div className="mt-6 space-y-5">
                {aboutPageContent.hero.signals.map((signal) => (
                  <div
                    key={`${signal.label}-${signal.value}`}
                    className="border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {signal.label}
                    </p>
                    <p className="mt-2 font-display text-[1.55rem] leading-[1.02] tracking-[-0.04em] text-foreground">
                      {signal.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Reveal>
      </Section>

      <Section spacing="tight">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="2xl"
              className="lg:grid-cols-[0.34fr_0.66fr] lg:items-start"
            >
              <Stack gap="sm">
                <p className="section-kicker">
                  {aboutPageContent.story.kicker}
                </p>
                <TextReveal>
                  <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                    {aboutPageContent.story.title}
                  </h2>
                </TextReveal>
              </Stack>

              <div className="space-y-5">
                {aboutPageContent.story.paragraphs.map((paragraph) => (
                  <Prose key={paragraph} size="lg" measure="lg">
                    {paragraph}
                  </Prose>
                ))}
                <div className="surface-grain rounded-[1.8rem] border border-border/70 bg-white/80 p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)]">
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    The result
                  </p>
                  <p className="mt-4 font-display text-[2.1rem] leading-[0.98] tracking-[-0.045em] text-foreground sm:text-[2.5rem]">
                    A clearer commercial story, expressed with more editorial
                    confidence and less friction.
                  </p>
                </div>
              </div>
            </Grid>

            <div>
              <p className="section-kicker">
                {aboutPageContent.principles.kicker}
              </p>
              <div className="mt-4 max-w-3xl">
                <h3 className="font-display text-[2.3rem] leading-[0.96] tracking-[-0.05em] text-foreground sm:text-[3rem]">
                  {aboutPageContent.principles.title}
                </h3>
              </div>
              <RevealGroup
                className="mt-8 grid gap-4 lg:grid-cols-3"
                stagger={0.08}
              >
                {aboutPageContent.principles.items.map((principle) => (
                  <RevealItem key={principle.title}>
                    <article className="h-full rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4">
                      <p className="section-kicker">{principle.eyebrow}</p>
                      <h4 className="mt-5 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                        {principle.title}
                      </h4>
                      <p className="mt-5 text-base leading-7 text-muted-foreground">
                        {principle.body}
                      </p>
                    </article>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Stack>
        </Reveal>
      </Section>

      <Section id="about-capabilities" spacing="tight">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="xl"
              className="lg:grid-cols-[0.34fr_0.66fr] lg:items-end"
            >
              <Stack gap="sm">
                <p className="section-kicker">
                  {aboutPageContent.capabilities.kicker}
                </p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                  {aboutPageContent.capabilities.title}
                </h2>
              </Stack>
              <Prose measure="md">{aboutPageContent.capabilities.intro}</Prose>
            </Grid>

            <Suspense fallback={<AboutCapabilitiesFallback />}>
              <AboutCapabilitiesContent />
            </Suspense>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-border/70 bg-white px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground"
              >
                Browse all services
              </Link>
            </div>
          </Stack>
        </Reveal>
      </Section>

      <Section spacing="tight" surface="inverse">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="xl"
              className="lg:grid-cols-[0.42fr_0.58fr] lg:items-end"
            >
              <Stack gap="sm">
                <p className="section-kicker text-white/60">
                  {aboutPageContent.workingModel.kicker}
                </p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-white sm:text-[3.8rem] lg:text-[4.8rem]">
                  {aboutPageContent.workingModel.title}
                </h2>
              </Stack>
              <Prose measure="md" tone="inverse">
                {aboutPageContent.workingModel.intro}
              </Prose>
            </Grid>

            <Grid cols="four" gap="md">
              {processSteps.map((step) => (
                <article
                  key={`${step.step}-${step.title}`}
                  className="rounded-[1.8rem] bg-white p-6 text-foreground shadow-[0_16px_44px_rgba(0,0,0,0.16)]"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {step.step}
                  </p>
                  <h3 className="mt-4 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </article>
              ))}
            </Grid>
          </Stack>
        </Reveal>
      </Section>

      <Section id="about-proof" spacing="tight">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="xl"
              className="lg:grid-cols-[0.34fr_0.66fr] lg:items-end"
            >
              <Stack gap="sm">
                <p className="section-kicker">
                  {aboutPageContent.proof.kicker}
                </p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                  {aboutPageContent.proof.title}
                </h2>
              </Stack>
              <Prose measure="md">{aboutPageContent.proof.intro}</Prose>
            </Grid>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {aboutPageContent.proof.marksTitle}
              </p>
              <RevealGroup className="mt-5 flex flex-wrap gap-3" stagger={0.06}>
                {trustMarks.map((mark) => (
                  <RevealItem key={mark.name}>
                    <article className="rounded-full border border-border/70 bg-white px-4 py-3 shadow-[0_10px_26px_rgba(27,28,26,0.04)]">
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                        {mark.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {mark.note}
                      </p>
                    </article>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <Suspense fallback={<AboutProofFallback />}>
              <AboutProofContent />
            </Suspense>
          </Stack>
        </Reveal>
      </Section>

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
