"use client";

import { Reveal, RevealGroup, RevealItem } from "@/components/home/motion";
import { getHomePublicContent } from "@/constants/home/public-content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { FaqAccordion } from "@ui/components/marketing/faq-accordion";

export function FaqList({ locale }: { locale: string }) {
  const content = getHomePublicContent(locale).faq;

  return (
    <Section id="faq">
      <Reveal>
        <Grid gap="2xl" className="lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <Stack gap="lg">
            <h2 className="font-display text-[4rem] leading-[0.88] tracking-[-0.07em] text-foreground sm:text-[5rem] lg:text-[6rem]">
              FAQ<span className="text-primary">.</span>
            </h2>
            <Prose measure="sm" className="mt-1">
              {content.intro}
            </Prose>
          </Stack>

          <RevealGroup stagger={0.08}>
            <FaqAccordion
              items={content.items}
              itemWrapper={RevealItem}
              className="space-y-4"
            />
          </RevealGroup>
        </Grid>
      </Reveal>
    </Section>
  );
}
