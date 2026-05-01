import { Suspense } from "react";

import { Reveal } from "@/components/home/motion";
import { Link } from "@/lib/i18n/navigation";
import { getAboutPublicContent } from "@/constants/about/public-content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

import { AboutCapabilitiesContent } from "./about-capabilities-content";
import { AboutCapabilitiesFallback } from "./about-capabilities-grid-fallback";

export function AboutCapabilitiesSection({ locale }: { locale: string }) {
  const content = getAboutPublicContent(locale);

  return (
    <Section id="about-capabilities" spacing="tight">
      <Reveal>
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.34fr_0.66fr] lg:items-end">
            <Stack gap="sm">
              <p className="section-kicker">{content.capabilities.kicker}</p>
              <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                {content.capabilities.title}
              </h2>
            </Stack>
            <Prose measure="md">{content.capabilities.intro}</Prose>
          </Grid>

          <Suspense fallback={<AboutCapabilitiesFallback />}>
            <AboutCapabilitiesContent />
          </Suspense>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex items-center rounded-full border border-border/70 bg-white px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground"
            >
              {content.capabilitiesBrowseLabel}
            </Link>
          </div>
        </Stack>
      </Reveal>
    </Section>
  );
}
