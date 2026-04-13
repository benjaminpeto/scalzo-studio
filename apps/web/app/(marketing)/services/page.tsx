import { Suspense } from "react";

import { getServicesIndexEntries } from "@/actions/services/get-services-index-entries";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
} from "@/components/home/motion";
import {
  servicePackageOptions,
  servicesFaqItems,
} from "@/constants/services/content";
import type { ServicesIndexEntry } from "@/interfaces/services/content";
import { marketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { FaqAccordion } from "@ui/components/marketing/faq-accordion";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";
import { ServiceCard } from "@ui/components/marketing/service-card";

export const metadata = marketingRouteMetadata.services;

async function ServicesGridContent() {
  const services = await getServicesIndexEntries();

  return <ServicesGrid services={services} />;
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
            metadata="Scalzo Studio service"
            outcome={service.outcome}
            showMarkers={false}
            title={service.title}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">Services</p>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.5rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.6rem] lg:text-[6.1rem]">
                  Services that clarify the offer before the page starts trying
                  to perform.
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                Strategy, design direction, and rollout support for teams that
                need a sharper commercial story, stronger structure, and a more
                credible first impression.
              </Prose>
            </Stack>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <p className="section-kicker">What changes</p>
              <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground">
                <p>
                  The message becomes easier to understand in the first scroll.
                </p>
                <p>
                  The page structure starts supporting confidence instead of
                  noise.
                </p>
                <p>
                  The visual system has room to scale into launches, content,
                  and follow-on pages.
                </p>
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
                <p className="section-kicker">Service list</p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                  A compact service menu, oriented around outcomes.
                </h2>
              </Stack>
              <Prose measure="md">
                Each engagement is structured to reduce ambiguity, sharpen
                decision-making, and give the site or launch a more coherent
                commercial role.
              </Prose>
            </Grid>

            <Suspense fallback={<ServicesGridFallback />}>
              <ServicesGridContent />
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
                <p className="section-kicker text-white/60">Ways to work</p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-white sm:text-[3.8rem] lg:text-[4.8rem]">
                  Choose the depth of support that matches the moment.
                </h2>
              </Stack>
              <Prose measure="md" tone="inverse">
                Some teams need a diagnostic reset. Others need a full page
                direction. Others need a consistent partner after the first
                release is live.
              </Prose>
            </Grid>

            <Grid cols="three" gap="md">
              {servicePackageOptions.map((option) => (
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
                A short clarification layer for scope, fit, and what stays in
                this ticket versus later service-detail work.
              </Prose>
            </Stack>

            <RevealGroup stagger={0.08}>
              <FaqAccordion
                items={servicesFaqItems}
                itemWrapper={RevealItem}
                className="space-y-4"
              />
            </RevealGroup>
          </Grid>
        </Reveal>
      </Section>

      <MarketingCtaBand
        id="contact"
        briefItems={[
          "Which offer needs to feel clearer or more premium?",
          "Where is the current page making the sale harder than it should be?",
          "What should a stronger service page or homepage help you win next?",
        ]}
        briefKicker="First conversation"
        className="pb-24"
        description="Most projects start with the current offer, the current page, and the point where confidence starts falling away. That is enough to define the next step."
        email={{
          href: "mailto:hello@scalzostudio.com",
          label: "hello@scalzostudio.com",
        }}
        kicker="Scalzo Studio"
        primaryAction={{ href: "/#contact", label: "Start a project" }}
        secondaryAction={{ href: "/#projects", label: "See featured work" }}
        title="Need the offer, the page, or the launch to feel more decisive?"
      />
    </>
  );
}
