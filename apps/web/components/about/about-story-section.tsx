import {
  Reveal,
  RevealGroup,
  RevealItem,
  TextReveal,
} from "@/components/home/motion";
import { aboutPageContent } from "@/constants/about/content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export function AboutStorySection() {
  return (
    <Section spacing="tight">
      <Reveal>
        <Stack gap="xl">
          <Grid
            gap="2xl"
            className="lg:grid-cols-[0.34fr_0.66fr] lg:items-start"
          >
            <Stack gap="sm">
              <p className="section-kicker">{aboutPageContent.story.kicker}</p>
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
  );
}
