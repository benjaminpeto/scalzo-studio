import type { Metadata } from "next";
import { Suspense } from "react";

import { NewsletterSignup } from "@/components/home/newsletter-signup";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import {
  getFallbackInsightEntries,
  getFallbackInsightTags,
  getInsightIndexEntries,
  getInsightTags,
  type InsightIndexEntry,
} from "@/lib/content/insights";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { BlogPostCard } from "@ui/components/marketing/blog-post-card";

interface InsightsPageProps {
  searchParams: Promise<{
    tag?: string;
  }>;
}

export const metadata: Metadata = {
  alternates: {
    canonical: "/insights",
  },
  description:
    "Editorial notes on positioning, page structure, design systems, and the visual signals that make service businesses easier to trust.",
  title: "Insights | Scalzo Studio",
};

function buildTagHref(tag: string) {
  const params = new URLSearchParams({ tag });

  return `/insights?${params.toString()}`;
}

function getEntryMetadata(entry: InsightIndexEntry) {
  const primaryTag = entry.tags[0];

  return primaryTag ? `${entry.date} / ${primaryTag}` : entry.date;
}

function InsightsHero({
  availableTags,
  selectedTag,
}: {
  availableTags: readonly string[];
  selectedTag: string | null;
}) {
  return (
    <Section spacing="roomy" className="overflow-hidden pb-14 lg:pb-18">
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
              <a
                href="/insights"
                aria-current={selectedTag ? undefined : "page"}
                className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                  selectedTag
                    ? "border-border/70 bg-white text-muted-foreground hover:text-foreground"
                    : "border-foreground bg-foreground text-background"
                }`}
              >
                All notes
              </a>
              {availableTags.map((tag) => {
                const isActive =
                  selectedTag?.toLowerCase() === tag.toLowerCase();

                return (
                  <a
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
                  </a>
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

function InsightsIndexLayout({
  entries,
  availableTags,
  selectedTag,
}: {
  availableTags: readonly string[];
  entries: ReadonlyArray<InsightIndexEntry>;
  selectedTag: string | null;
}) {
  const [featuredEntry, ...supportingEntries] = entries;

  return (
    <>
      <InsightsHero availableTags={availableTags} selectedTag={selectedTag} />

      <Section spacing="tight">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="xl"
              className="lg:grid-cols-[0.32fr_0.68fr] lg:items-end"
            >
              <Stack gap="sm">
                <TextReveal>
                  <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                    Featured article.
                  </h2>
                </TextReveal>
              </Stack>
              <Prose measure="md">
                The lead piece gives the clearest current example of how
                editorial structure and page decisions change the quality of the
                first impression.
              </Prose>
            </Grid>

            {featuredEntry ? (
              <BlogPostCard
                title={featuredEntry.title}
                variant="featured"
                metadata={getEntryMetadata(featuredEntry)}
                excerpt={featuredEntry.excerpt}
                image={{
                  alt: `Cover image for ${featuredEntry.title}`,
                  priority: true,
                  src: featuredEntry.image,
                }}
              />
            ) : (
              <div className="rounded-[1.9rem] border border-dashed border-border/70 bg-white/70 p-8">
                <p className="section-kicker">No posts yet</p>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  Published insights will appear here once the first editorial
                  note is ready.
                </p>
              </div>
            )}
          </Stack>
        </Reveal>
      </Section>

      <Section id="insight-list" spacing="tight">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="xl"
              className="lg:grid-cols-[0.32fr_0.68fr] lg:items-end"
            >
              <Stack gap="sm">
                <TextReveal>
                  <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                    Post index.
                  </h2>
                </TextReveal>
              </Stack>
              <Prose measure="md">
                Every note is grouped by its primary tag so recurring themes in
                positioning, design systems, content, and trust signals stay
                easy to scan.
              </Prose>
            </Grid>

            {supportingEntries.length ? (
              <RevealGroup className="grid gap-5 md:grid-cols-2" stagger={0.08}>
                {supportingEntries.map((entry) => (
                  <RevealItem key={entry.slug}>
                    <BlogPostCard
                      title={entry.title}
                      metadata={getEntryMetadata(entry)}
                      excerpt={entry.excerpt}
                      image={{
                        alt: `Cover image for ${entry.title}`,
                        src: entry.image,
                      }}
                      footerAccessory={
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                              <a
                                key={`${entry.slug}-${tag}`}
                                href={buildTagHref(tag)}
                                className="rounded-full border border-border/70 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                              >
                                {tag}
                              </a>
                            ))}
                          </div>
                          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
                            Full article route lands next
                          </p>
                        </div>
                      }
                    />
                  </RevealItem>
                ))}
              </RevealGroup>
            ) : (
              <div className="rounded-[1.9rem] border border-dashed border-border/70 bg-white/70 p-8">
                <p className="section-kicker">No matches</p>
                <p className="mt-5 text-base leading-7 text-muted-foreground">
                  There are no published insights under this topic yet. Try a
                  different tag or browse the full index instead.
                </p>
              </div>
            )}
          </Stack>
        </Reveal>
      </Section>

      <NewsletterSignup />
    </>
  );
}

async function InsightsPageContent({
  selectedTag,
}: {
  selectedTag: string | null;
}) {
  const [entries, availableTags] = await Promise.all([
    getInsightIndexEntries(selectedTag),
    getInsightTags(),
  ]);

  return (
    <InsightsIndexLayout
      entries={entries}
      availableTags={availableTags}
      selectedTag={selectedTag}
    />
  );
}

function InsightsPageFallback({ selectedTag }: { selectedTag: string | null }) {
  return (
    <InsightsIndexLayout
      entries={getFallbackInsightEntries(selectedTag)}
      availableTags={getFallbackInsightTags()}
      selectedTag={selectedTag}
    />
  );
}

async function ResolvedInsightsPage({ searchParams }: InsightsPageProps) {
  const params = await searchParams;
  const selectedTag = params.tag?.trim() ? params.tag.trim() : null;

  return (
    <Suspense fallback={<InsightsPageFallback selectedTag={selectedTag} />}>
      <InsightsPageContent selectedTag={selectedTag} />
    </Suspense>
  );
}

export default function InsightsPage(props: InsightsPageProps) {
  return (
    <Suspense fallback={<InsightsPageFallback selectedTag={null} />}>
      <ResolvedInsightsPage {...props} />
    </Suspense>
  );
}
