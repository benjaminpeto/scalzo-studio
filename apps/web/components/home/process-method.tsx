import {
  HoverCard,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import { processSteps } from "@/constants/home/content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export function ProcessMethod() {
  return (
    <Section
      id="method"
      surface="inverse"
      className="overflow-hidden"
      containerClassName="py-18"
    >
      <Reveal>
        <Stack gap="2xl">
          <ScrollFloat className="mx-auto max-w-3xl" offset={30}>
            <Stack gap="lg">
              <TextReveal>
                <h2 className="font-display text-[3rem] leading-[0.9] tracking-[-0.06em] text-white sm:text-[4rem] lg:text-[5.2rem]">
                  Every strong homepage starts with sharper meaning.
                </h2>
              </TextReveal>
              <TextReveal delay={0.08}>
                <Prose measure="lg" size="lg" tone="inverse">
                  The method rests on four pillars. We read the context,
                  position the message, express the brand through the interface,
                  and shape the navigation so the ambition becomes more legible.
                </Prose>
              </TextReveal>
            </Stack>
          </ScrollFloat>

          <RevealGroup stagger={0.08}>
            <Grid cols="four" gap="md">
              {processSteps.map((step, index) => (
                <RevealItem key={step.step}>
                  <HoverCard>
                    <article className="h-full rounded-[1.7rem] bg-white p-6 text-foreground shadow-[0_18px_40px_rgba(0,0,0,0.14)]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-1">
                          {Array.from({ length: 4 }).map((_, dotIndex) => (
                            <span
                              key={`${step.step}-${dotIndex}`}
                              className={`inline-block size-2 rounded-full ${
                                dotIndex <= index ? "bg-primary" : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {step.step}
                        </p>
                      </div>
                      <h3 className="mt-10 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-6 text-base leading-7 text-muted-foreground">
                        {step.description}
                      </p>
                    </article>
                  </HoverCard>
                </RevealItem>
              ))}
            </Grid>
          </RevealGroup>
        </Stack>
      </Reveal>
    </Section>
  );
}
