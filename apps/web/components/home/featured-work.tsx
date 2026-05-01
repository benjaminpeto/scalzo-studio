import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  HoverCard,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { CaseStudyCard } from "@ui/components/marketing/case-study-card";
import { FeaturedProject } from "@/interfaces/home/content";

export function FeaturedWork({
  projects,
}: {
  projects: ReadonlyArray<FeaturedProject>;
}) {
  return (
    <Section id="projects">
      <Reveal>
        <Stack gap="xl">
          <Grid
            gap="xl"
            className="lg:grid-cols-[0.24fr_0.52fr_0.24fr] lg:items-end"
          >
            <div className="pt-3">
              <p className="inline-flex items-center gap-2 text-sm text-foreground">
                <span className="inline-block size-2 rounded-full bg-primary" />
                Notre travail
              </p>
            </div>
            <ScrollFloat offset={28}>
              <Stack gap="sm">
                <TextReveal>
                  <h2 className="font-display text-[4rem] leading-[0.88] tracking-[-0.07em] text-foreground sm:text-[5rem] lg:text-[6.3rem]">
                    Projets<span className="text-primary">.</span>
                  </h2>
                </TextReveal>
                <TextReveal delay={0.08}>
                  <Prose size="lg" tone="strong">
                    Ambition made visible.
                  </Prose>
                </TextReveal>
              </Stack>
            </ScrollFloat>
            <ScrollFloat offset={34}>
              <Prose measure="sm" className="lg:justify-self-end">
                Editorial case studies with one large visual rhythm, a quieter
                text line, and enough asymmetry to feel designed rather than
                templated.
              </Prose>
            </ScrollFloat>
          </Grid>

          <RevealGroup stagger={0.12}>
            <Grid cols="two" gap="md">
              {projects.map((project) => (
                <RevealItem key={project.title}>
                  <ScrollFloat offset={18}>
                    <HoverCard>
                      <CaseStudyCard
                        title={project.title}
                        variant="compact"
                        metadata={
                          <>
                            {project.category} / {project.accent}
                          </>
                        }
                        image={project.image}
                        footerAccessory={
                          <span className="inline-flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 group-hover:border-primary group-hover:text-primary">
                            <ArrowUpRight
                              className="size-4"
                              aria-hidden="true"
                            />
                          </span>
                        }
                      />
                    </HoverCard>
                  </ScrollFloat>
                </RevealItem>
              ))}
            </Grid>
          </RevealGroup>

          <div className="flex justify-end">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-foreground transition-colors hover:text-primary"
            >
              Start a similar project
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Stack>
      </Reveal>
    </Section>
  );
}
