import Link from "next/link";

import { InsightMarkdown } from "@/components/insights/insight-markdown";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
} from "@/components/home/motion";
import type { ServiceDetailPageData } from "@/interfaces/services/content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { CaseStudyCard } from "@ui/components/marketing/case-study-card";
import { FaqAccordion } from "@ui/components/marketing/faq-accordion";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";
import { ServiceCard } from "@ui/components/marketing/service-card";

interface ServiceDetailLayoutProps {
  detailPageData: ServiceDetailPageData;
}

export default function ServiceDetailLayout({
  detailPageData,
}: ServiceDetailLayoutProps) {
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">Service detail</p>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Link
                  href="/services"
                  className="transition-colors hover:text-foreground"
                >
                  Services
                </Link>
                <span aria-hidden="true">/</span>
                <span>{detailPageData.title}</span>
              </div>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.5rem] lg:text-[5.9rem]">
                  {detailPageData.title}
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                {detailPageData.summary}
              </Prose>
            </Stack>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <p className="section-kicker">Commercial outcome</p>
              <p className="mt-5 font-display text-[2.4rem] leading-[0.95] tracking-[-0.05em] text-foreground sm:text-[3rem]">
                {detailPageData.outcome}
              </p>
              <p className="mt-6 border-t border-border/70 pt-5 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                Built for stronger positioning, more legible offers, and calmer
                decisions.
              </p>
            </div>
          </Grid>
        </Reveal>
      </Section>

      <Section spacing="tight">
        <Reveal>
          <Grid
            gap="2xl"
            className="lg:grid-cols-[0.38fr_0.62fr] lg:items-start"
          >
            <Stack gap="sm">
              <p className="section-kicker">Problem framing</p>
              <h2 className="font-display text-[2.7rem] leading-[0.94] tracking-[-0.055em] text-foreground sm:text-[3.6rem] lg:text-[4.4rem]">
                Where the friction usually starts.
              </h2>
            </Stack>
            <div className="space-y-5">
              <Prose size="lg" tone="strong" measure="lg">
                {detailPageData.problem}
              </Prose>
              {detailPageData.content ? (
                <div className="space-y-5">
                  <InsightMarkdown content={detailPageData.content} />
                </div>
              ) : null}
            </div>
          </Grid>
        </Reveal>
      </Section>

      <Section spacing="tight">
        <Reveal>
          <Grid
            gap="xl"
            className="lg:grid-cols-[0.36fr_0.64fr] lg:items-start"
          >
            <Stack gap="sm">
              <p className="section-kicker">Deliverables</p>
              <h2 className="font-display text-[2.7rem] leading-[0.94] tracking-[-0.055em] text-foreground sm:text-[3.6rem] lg:text-[4.4rem]">
                What gets clarified, structured, or shipped.
              </h2>
            </Stack>

            <ServiceCard
              className="rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4"
              description={detailPageData.summary}
              items={detailPageData.deliverables}
              metadata="Core deliverables"
              showMarkers={false}
              title={detailPageData.title}
            />
          </Grid>
        </Reveal>
      </Section>

      <Section spacing="tight" surface="inverse">
        <Reveal>
          <Stack gap="xl">
            <Grid gap="xl" className="lg:grid-cols-[0.4fr_0.6fr] lg:items-end">
              <Stack gap="sm">
                <p className="section-kicker text-white/60">
                  Process and timeline
                </p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-white sm:text-[3.8rem] lg:text-[4.8rem]">
                  A short route from diagnosis to a clearer commercial surface.
                </h2>
              </Stack>
              <Prose measure="md" tone="inverse">
                The exact depth changes by scope, but the sequence stays
                grounded in reading the friction, shaping the direction, and
                landing it in a live context.
              </Prose>
            </Grid>

            <Grid cols="three" gap="md">
              {detailPageData.timeline.map((step, index) => (
                <article
                  key={`${step.step}-${step.title}`}
                  className="rounded-[1.8rem] bg-white p-6 text-foreground shadow-[0_16px_44px_rgba(0,0,0,0.16)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1">
                      {Array.from({
                        length: detailPageData.timeline.length,
                      }).map((_, dotIndex) => (
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
                  <h3 className="mt-8 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-muted-foreground">
                    {step.body}
                  </p>
                </article>
              ))}
            </Grid>
          </Stack>
        </Reveal>
      </Section>

      <Section spacing="tight">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="xl"
              className="lg:grid-cols-[0.34fr_0.66fr] lg:items-end"
            >
              <Stack gap="sm">
                <p className="section-kicker">Related work</p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                  Examples of how this direction lands in the real world.
                </h2>
              </Stack>
              <Prose measure="md">
                These case studies show the kind of clarity, hierarchy, and
                confidence this service is meant to create once it moves from
                strategy into a live page or launch.
              </Prose>
            </Grid>

            <RevealGroup className="grid gap-5 lg:grid-cols-2" stagger={0.08}>
              {detailPageData.relatedWork.map((item) => (
                <RevealItem key={item.title}>
                  <CaseStudyCard
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    metadata={item.metadata}
                    outcome={item.outcome}
                    footerAccessory={
                      <span className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                        Work detail arrives in the next slice
                      </span>
                    }
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          </Stack>
        </Reveal>
      </Section>

      <Section id="service-detail-faq">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
            <Stack gap="lg">
              <h2 className="font-display text-[4rem] leading-[0.88] tracking-[-0.07em] text-foreground sm:text-[5rem] lg:text-[6rem]">
                FAQ<span className="text-primary">.</span>
              </h2>
              <Prose measure="sm" className="mt-1">
                A final clarification layer before the conversation turns into a
                concrete scope.
              </Prose>
            </Stack>

            <RevealGroup stagger={0.08}>
              <FaqAccordion
                items={detailPageData.faq}
                itemWrapper={RevealItem}
                className="space-y-4"
              />
            </RevealGroup>
          </Grid>
        </Reveal>
      </Section>

      <MarketingCtaBand
        id="contact"
        briefItems={[
          `What would ${detailPageData.title.toLowerCase()} need to solve first?`,
          "Which page, launch, or offer currently feels weaker than the business behind it?",
          "What should a clearer service direction help you win next?",
        ]}
        briefKicker="Next step"
        className="pb-24"
        description={`If ${detailPageData.title.toLowerCase()} feels like the right fit, the first conversation should clarify the current friction, the level of ambition, and the outcome the next page needs to create.`}
        email={{
          href: "mailto:hello@scalzostudio.com",
          label: "hello@scalzostudio.com",
        }}
        kicker="Scalzo Studio"
        primaryAction={{
          href: "/contact#booking",
          label: "Book a discovery call",
        }}
        secondaryAction={{ href: "/services", label: "Back to services" }}
        title={`Ready to use ${detailPageData.title.toLowerCase()} as a sharper commercial tool?`}
      />
    </>
  );
}
