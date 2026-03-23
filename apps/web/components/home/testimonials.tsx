import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import type { Testimonial } from "@/components/home/content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { TestimonialCard } from "@ui/components/marketing/testimonial-card";

export function Testimonials({ items }: { items: ReadonlyArray<Testimonial> }) {
  return (
    <Section id="testimonials">
      <Reveal>
        <Grid gap="xl" className="lg:grid-cols-[0.34fr_0.66fr] lg:gap-12">
          <ScrollFloat offset={24}>
            <Stack gap="sm">
              <p className="section-kicker">Selected words</p>
              <TextReveal>
                <h2 className="font-display text-[3.3rem] leading-[0.9] tracking-[-0.06em] text-foreground sm:text-[4.5rem] lg:text-[5.2rem]">
                  The page feels more certain when the proof sounds human.
                </h2>
              </TextReveal>
              <TextReveal delay={0.08}>
                <Prose measure="md">
                  Short reflections from teams that needed a homepage to look
                  more established, explain itself faster, and support better
                  conversations after the first visit.
                </Prose>
              </TextReveal>
            </Stack>
          </ScrollFloat>

          <RevealGroup
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            stagger={0.1}
          >
            {items.map((testimonial) => (
              <RevealItem key={`${testimonial.name}-${testimonial.company}`}>
                <ScrollFloat offset={18}>
                  <TestimonialCard
                    company={testimonial.company}
                    name={testimonial.name}
                    quote={testimonial.quote}
                    role={testimonial.role}
                    className="h-full"
                  />
                </ScrollFloat>
              </RevealItem>
            ))}
          </RevealGroup>
        </Grid>
      </Reveal>
    </Section>
  );
}
