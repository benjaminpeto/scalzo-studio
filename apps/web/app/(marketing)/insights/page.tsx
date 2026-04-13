import Link from "next/link";
import { Suspense } from "react";

import { getInsightIndexEntries } from "@/actions/insights/get-insight-index-entries";
import { getInsightTags } from "@/actions/insights/get-insight-tags";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import type { InsightIndexEntry } from "@/interfaces/insights/content";
import { marketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
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

export const metadata = marketingRouteMetadata.insights;

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
                cta={{
                  href: `/insights/${featuredEntry.slug}`,
                  label: "Read article",
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
                      cta={{
                        href: `/insights/${entry.slug}`,
                        label: "Read article",
                      }}
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

      <NewsletterSignup placement="insights-index" />
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
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Grid gap="2xl" className="lg:grid-cols-[0.6fr_0.4fr] lg:items-end">
          <Stack gap="lg">
            <div className="h-4 w-24 rounded-full bg-black/8" />
            <div className="space-y-3">
              <div className="h-16 max-w-4xl rounded-[1.6rem] bg-black/8 sm:h-20 lg:h-24" />
              <div className="h-16 max-w-3xl rounded-[1.6rem] bg-black/6 sm:h-20 lg:h-24" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-2xl rounded-full bg-black/7" />
              <div className="h-4 max-w-xl rounded-full bg-black/5" />
            </div>
          </Stack>

          <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
            <div className="h-4 w-32 rounded-full bg-black/8" />
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="h-9 w-24 rounded-full bg-black/8" />
              <div className="h-9 w-28 rounded-full bg-black/6" />
              <div className="h-9 w-32 rounded-full bg-black/5" />
            </div>
            <div className="mt-6 space-y-3 border-t border-border/70 pt-5">
              <div className="h-4 rounded-full bg-black/7" />
              <div className="h-4 max-w-[85%] rounded-full bg-black/5" />
            </div>
          </div>
        </Grid>
      </Section>

      <Section spacing="tight">
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
            <div className="space-y-3">
              <div className="h-12 w-56 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-xl rounded-full bg-black/7" />
              <div className="h-4 max-w-lg rounded-full bg-black/5" />
            </div>
          </Grid>

          <div className="overflow-hidden rounded-[1.85rem] bg-[#111311]">
            <div className="aspect-[1.5] w-full bg-white/8" />
            <div className="space-y-4 p-7 sm:p-8">
              <div className="h-4 w-40 rounded-full bg-white/14" />
              <div className="h-10 max-w-3xl rounded-[1rem] bg-white/14" />
              <div className="h-10 max-w-2xl rounded-[1rem] bg-white/10" />
              <div className="h-4 max-w-2xl rounded-full bg-white/12" />
            </div>
          </div>
        </Stack>
      </Section>

      <Section id="insight-list" spacing="tight">
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.32fr_0.68fr] lg:items-end">
            <div className="space-y-3">
              <div className="h-12 w-44 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-xl rounded-full bg-black/7" />
              <div className="h-4 max-w-lg rounded-full bg-black/5" />
            </div>
          </Grid>

          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: selectedTag ? 2 : 4 }).map((_, index) => (
              <article
                key={index}
                className="flex h-full flex-col rounded-[1.85rem] bg-white p-4 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-5"
              >
                <div className="aspect-square w-full rounded-[1.1rem] bg-black/6" />
                <div className="mt-6 h-4 w-32 rounded-full bg-black/8" />
                <div className="mt-4 space-y-3">
                  <div className="h-8 rounded-[0.9rem] bg-black/8" />
                  <div className="h-8 max-w-[80%] rounded-[0.9rem] bg-black/6" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-4 rounded-full bg-black/7" />
                  <div className="h-4 max-w-[88%] rounded-full bg-black/5" />
                </div>
                <div className="mt-auto pt-6">
                  <div className="h-4 w-28 rounded-full bg-black/8" />
                </div>
              </article>
            ))}
          </div>
        </Stack>
      </Section>

      <NewsletterSignup placement="insights-index" />
    </>
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
