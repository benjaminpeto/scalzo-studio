import { Reveal, ScrollFloat } from "@/components/home/motion";
import { getAboutPublicContent } from "@/constants/about/public-content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export function AboutHeroSection({ locale }: { locale: string }) {
  const content = getAboutPublicContent(locale).hero;

  return (
    <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
      <Reveal>
        <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <Stack gap="lg">
            <p className="section-kicker">{content.kicker}</p>
            <ScrollFloat offset={24}>
              <h1 className="max-w-5xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.5rem] lg:text-[5.9rem]">
                {content.title}
              </h1>
            </ScrollFloat>
            <Prose size="lg" measure="lg">
              {content.intro}
            </Prose>
            <div className="space-y-4">
              {content.supporting.map((paragraph) => (
                <Prose key={paragraph} measure="lg">
                  {paragraph}
                </Prose>
              ))}
            </div>
          </Stack>

          <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
            <p className="section-kicker">{content.panelTitle}</p>
            <div className="mt-6 space-y-5">
              {content.signals.map((signal) => (
                <div
                  key={`${signal.label}-${signal.value}`}
                  className="border-b border-border/60 pb-4 last:border-b-0 last:pb-0"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {signal.label}
                  </p>
                  <p className="mt-2 font-display text-[1.55rem] leading-[1.02] tracking-[-0.04em] text-foreground">
                    {signal.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Grid>
      </Reveal>
    </Section>
  );
}
