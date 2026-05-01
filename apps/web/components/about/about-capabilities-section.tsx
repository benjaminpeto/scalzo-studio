import Link from "next/link";
import { Suspense } from "react";

import { Reveal } from "@/components/home/motion";
import { aboutPageContent } from "@/constants/about/content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

import { AboutCapabilitiesContent } from "./about-capabilities-content";
import { AboutCapabilitiesFallback } from "./about-capabilities-grid-fallback";

export function AboutCapabilitiesSection() {
  return (
    <Section id="about-capabilities" spacing="tight">
      <Reveal>
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.34fr_0.66fr] lg:items-end">
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
  );
}
