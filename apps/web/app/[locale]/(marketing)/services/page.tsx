import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { getServicesIndexEntries } from "@/actions/services/get-services-index-entries";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
} from "@/components/home/motion";
import { getServicesPublicContent } from "@/constants/services/public-content";
import type { ServicesIndexEntry } from "@/interfaces/services/content";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { FaqAccordion } from "@ui/components/marketing/faq-accordion";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";
import { ServiceCard } from "@ui/components/marketing/service-card";
import { MarketingPageProps } from "@/interfaces/home/content";

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "services");
}

async function ServicesGridContent({
  ctaLabel,
  metadata,
}: {
  ctaLabel: string;
  metadata: string;
}) {
  const services = await getServicesIndexEntries();

  return (
    <ServicesGrid ctaLabel={ctaLabel} metadata={metadata} services={services} />
  );
}

function ServicesGridFallback() {
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
          <div className="mt-6 h-4 w-40 rounded-full bg-black/8" />
        </article>
      ))}
    </div>
  );
}

function ServicesGrid({
  ctaLabel,
  metadata,
  services,
}: {
  ctaLabel: string;
  metadata: string;
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
              label: ctaLabel,
            }}
            description={service.summary}
            indexLabel={`0${index + 1}`}
            items={service.deliverables}
            metadata={metadata}
            outcome={service.outcome}
            showMarkers={false}
            title={service.title}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export default async function ServicesPage({ params }: MarketingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getServicesPublicContent(locale);
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">{content.hero.kicker}</p>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.5rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.6rem] lg:text-[6.1rem]">
                  {content.hero.title}
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                {content.hero.intro}
              </Prose>
            </Stack>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <p className="section-kicker">{content.hero.sidePanelLabel}</p>
              <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground">
                {content.hero.sidePanelPoints.map((point) => (
                  <p key={point}>{point}</p>
                ))}
              </div>
            </div>
          </Grid>
        </Reveal>
      </Section>

      <Section id="service-list" spacing="tight">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="xl"
              className="lg:grid-cols-[0.34fr_0.66fr] lg:items-end"
            >
              <Stack gap="sm">
                <p className="section-kicker">{content.servicesList.kicker}</p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                  {content.servicesList.heading}
                </h2>
              </Stack>
              <Prose measure="md">{content.servicesList.intro}</Prose>
            </Grid>

            <Suspense fallback={<ServicesGridFallback />}>
              <ServicesGridContent
                ctaLabel={content.servicesList.ctaLabel}
                metadata={content.servicesList.metadata}
              />
            </Suspense>
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
                  {content.packagesSection.kicker}
                </p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-white sm:text-[3.8rem] lg:text-[4.8rem]">
                  {content.packagesSection.title}
                </h2>
              </Stack>
              <Prose measure="md" tone="inverse">
                {content.packagesSection.intro}
              </Prose>
            </Grid>

            <Grid cols="three" gap="md">
              {content.packages.map((option) => (
                <article
                  key={option.label}
                  className="rounded-[1.8rem] bg-white p-6 text-foreground shadow-[0_16px_44px_rgba(0,0,0,0.16)]"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {option.timeline}
                  </p>
                  <h3 className="mt-4 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                    {option.label}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-muted-foreground">
                    {option.summary}
                  </p>
                  <p className="mt-6 border-t border-border/70 pt-5 text-sm uppercase tracking-[0.18em] text-foreground">
                    {option.bestFor}
                  </p>
                </article>
              ))}
            </Grid>
          </Stack>
        </Reveal>
      </Section>

      <Section id="service-faq">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            <Stack gap="lg">
              <h2 className="font-display text-[4rem] leading-[0.88] tracking-[-0.07em] text-foreground sm:text-[5rem] lg:text-[6rem]">
                FAQ<span className="text-primary">.</span>
              </h2>
              <Prose measure="sm" className="mt-1">
                {content.faq.intro}
              </Prose>
            </Stack>

            <RevealGroup stagger={0.08}>
              <FaqAccordion
                items={content.faq.items}
                itemWrapper={RevealItem}
                className="space-y-4"
              />
            </RevealGroup>
          </Grid>
        </Reveal>
      </Section>

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
          href: "/#contact",
          label: content.cta.primaryActionLabel,
        }}
        secondaryAction={{
          href: "/#projects",
          label: content.cta.secondaryActionLabel,
        }}
        title={content.cta.title}
      />
    </>
  );
}
