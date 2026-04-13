import { Suspense } from "react";

import { getWorkIndexEntries } from "@/actions/work/get-work-index-entries";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import type { WorkIndexEntry } from "@/interfaces/work/content";
import { marketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { CaseStudyCard } from "@ui/components/marketing/case-study-card";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";

export const metadata = marketingRouteMetadata.work;

async function WorkGridContent() {
  const entries = await getWorkIndexEntries();

  return <WorkGrid entries={entries} />;
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

function WorkGrid({ entries }: { entries: ReadonlyArray<WorkIndexEntry> }) {
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
            cta={{ href: `/work/${entry.slug}`, label: "Read case study" }}
          />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export default function WorkPage() {
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">Selected work</p>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.5rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.6rem] lg:text-[6.1rem]">
                  Case studies that show what stronger clarity looks like once
                  it is live.
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                A published index of projects where positioning, page structure,
                and visual direction were sharpened to make the work feel more
                credible and commercially useful.
              </Prose>
            </Stack>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <p className="section-kicker">What to look for</p>
              <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground">
                <p>
                  How the offer becomes easier to understand in the first
                  scroll.
                </p>
                <p>
                  How trust, proof, and pacing are reorganized into a calmer
                  decision path.
                </p>
                <p>
                  How strategy becomes visible in the actual interface, not just
                  the pitch.
                </p>
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
                    The work index.
                  </h2>
                </TextReveal>
              </Stack>
              <Prose measure="md">
                Each case study is listed with the sector or service context and
                one key metric or outcome so the commercial shift is visible at
                a glance.
              </Prose>
            </Grid>

            <Suspense fallback={<WorkGridFallback />}>
              <WorkGridContent />
            </Suspense>
          </Stack>
        </Reveal>
      </Section>

      <MarketingCtaBand
        id="contact"
        briefItems={[
          "Which page or offer currently feels weaker than the business behind it?",
          "What should stronger positioning or a better first impression help you win next?",
          "Where is the current site making trust harder than it needs to be?",
        ]}
        briefKicker="Project brief"
        className="pb-24"
        description="If the work here feels close to the shift you need, the next step is a direct conversation about the current friction, the ambition, and the outcome the page should create."
        email={{
          href: "mailto:hello@scalzostudio.com",
          label: "hello@scalzostudio.com",
        }}
        kicker="Scalzo Studio"
        primaryAction={{ href: "/#contact", label: "Start a similar project" }}
        secondaryAction={{ href: "/services", label: "Browse services" }}
        title="Need a page or launch to feel more established in the first impression?"
      />
    </>
  );
}
