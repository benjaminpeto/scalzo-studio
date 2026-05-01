import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { getWorkIndexEntries } from "@/actions/work/get-work-index-entries";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import type { WorkIndexEntry } from "@/interfaces/work/content";
import { getWorkPublicContent } from "@/constants/work/public-content";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { CaseStudyCard } from "@ui/components/marketing/case-study-card";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";
import { MarketingPageProps } from "@/interfaces/home/content";

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "work");
}

async function WorkGridContent({ ctaLabel }: { ctaLabel: string }) {
  const entries = await getWorkIndexEntries();

  return <WorkGrid ctaLabel={ctaLabel} entries={entries} />;
}

function WorkGridFallback() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <article
          key={index}
          className="overflow-hidden rounded-[1.7rem] bg-white shadow-[0_8px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4"
        >
          <div className="aspect-[1.08] w-full bg-black/6" />
          <div className="space-y-3 px-5 py-4 sm:px-6">
            <div className="h-8 w-52 rounded-[0.9rem] bg-black/8" />
            <div className="h-4 w-44 rounded-full bg-black/6" />
            <div className="h-4 max-w-[88%] rounded-full bg-black/5" />
            <div className="h-4 w-36 rounded-full bg-black/7" />
          </div>
        </article>
      ))}
    </div>
  );
}

function WorkGrid({
  ctaLabel,
  entries,
}: {
  ctaLabel: string;
  entries: ReadonlyArray<WorkIndexEntry>;
}) {
  return (
    <RevealGroup className="grid gap-5 lg:grid-cols-2" stagger={0.08}>
      {entries.map((entry) => (
        <RevealItem key={entry.slug}>
          <CaseStudyCard
            title={entry.title}
            description={entry.description}
            image={entry.image}
            metadata={entry.metadata}
            outcome={entry.metric}
            cta={{ href: `/work/${entry.slug}`, label: ctaLabel }}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export default async function WorkPage({ params }: MarketingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getWorkPublicContent(locale);
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
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

      <Section id="work-grid" spacing="tight">
        <Reveal>
          <Stack gap="xl">
            <Grid gap="xl" className="lg:grid-cols-[0.3fr_0.7fr] lg:items-end">
              <Stack gap="sm">
                <TextReveal>
                  <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                    {content.grid.title}
                  </h2>
                </TextReveal>
              </Stack>
              <Prose measure="md">{content.grid.intro}</Prose>
            </Grid>

            <Suspense fallback={<WorkGridFallback />}>
              <WorkGridContent ctaLabel={content.grid.ctaLabel} />
            </Suspense>
          </Stack>
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
          href: "/services",
          label: content.cta.secondaryActionLabel,
        }}
        title={content.cta.title}
      />
    </>
  );
}
