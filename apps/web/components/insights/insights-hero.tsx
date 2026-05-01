import Link from "next/link";

import { Reveal, ScrollFloat } from "@/components/home/motion";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { buildTagHref } from "@/lib/helpers";

export function InsightsHero({
  availableTags,
  selectedTag,
}: {
  availableTags: readonly string[];
  selectedTag: string | null;
}) {
  return (
    <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
      <Reveal>
        <Grid gap="2xl" className="lg:grid-cols-[0.6fr_0.4fr] lg:items-end">
          <Stack gap="lg">
            <p className="section-kicker">Insights</p>
            <ScrollFloat offset={24}>
              <h1 className="max-w-5xl font-display text-[3.5rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.6rem] lg:text-[6.1rem]">
                Notes on clarity, positioning, and the visual signals that make
                trust easier.
              </h1>
            </ScrollFloat>
            <Prose size="lg" measure="lg">
              A growing index of short editorial pieces on homepage hierarchy,
              service-page structure, content systems, and the design decisions
              that make a business feel more established on first contact.
            </Prose>
          </Stack>

          <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
            <p className="section-kicker">Browse by topic</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/insights"
                aria-current={selectedTag ? undefined : "page"}
                className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                  selectedTag
                    ? "border-border/70 bg-white text-muted-foreground hover:text-foreground"
                    : "border-foreground bg-foreground text-background"
                }`}
              >
                All notes
              </Link>
              {availableTags.map((tag) => {
                const isActive =
                  selectedTag?.toLowerCase() === tag.toLowerCase();

                return (
                  <Link
                    key={tag}
                    href={buildTagHref(tag)}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                      isActive
                        ? "border-foreground bg-foreground text-background"
                        : "border-border/70 bg-white text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </Link>
                );
              })}
            </div>
            <p className="mt-6 border-t border-border/70 pt-5 text-sm leading-6 text-muted-foreground">
              Short, practical notes with a bias toward real page structure,
              clearer proof, and calmer commercial decisions.
            </p>
          </div>
        </Grid>
      </Reveal>
    </Section>
  );
}
