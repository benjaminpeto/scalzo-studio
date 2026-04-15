import { Reveal } from "@/components/home/motion";
import { processSteps } from "@/components/home/content";
import { aboutPageContent } from "@/constants/about/content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export function AboutWorkingModelSection() {
  return (
    <Section spacing="tight" surface="inverse">
      <Reveal>
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.42fr_0.58fr] lg:items-end">
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
  );
}
