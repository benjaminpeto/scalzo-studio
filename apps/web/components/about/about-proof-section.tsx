import { Suspense } from "react";

import { Reveal, RevealGroup, RevealItem } from "@/components/home/motion";
import { getAboutPublicContent } from "@/constants/about/public-content";
import { getHomePublicContent } from "@/constants/home/public-content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

import type { Locale } from "@/lib/i18n/routing";

import { AboutProofContent } from "./about-proof-content";
import { AboutProofFallback } from "./about-proof-fallback";

export function AboutProofSection({ locale }: { locale: string }) {
  const content = getAboutPublicContent(locale).proof;
  const trustMarks = getHomePublicContent(locale).trustMarks;

  return (
    <Section id="about-proof" spacing="tight">
      <Reveal>
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.34fr_0.66fr] lg:items-end">
            <Stack gap="sm">
              <p className="section-kicker">{content.kicker}</p>
              <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                {content.title}
              </h2>
            </Stack>
            <Prose measure="md">{content.intro}</Prose>
          </Grid>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {content.marksTitle}
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
            <AboutProofContent locale={locale as Locale} />
          </Suspense>
        </Stack>
      </Reveal>
    </Section>
  );
}
