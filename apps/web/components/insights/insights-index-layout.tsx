import { getInsightIndexEntries } from "@/actions/insights/get-insight-index-entries";
import { getInsightTags } from "@/actions/insights/get-insight-tags";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  TextReveal,
} from "@/components/home/motion";
import { InsightsHero } from "@/components/insights/insights-hero";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import type { InsightIndexEntry } from "@/interfaces/insights/content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { BlogPostCard } from "@ui/components/marketing/blog-post-card";

function getEntryMetadata(entry: InsightIndexEntry) {
  const primaryTag = entry.tags[0];

  return primaryTag ? `${entry.date} / ${primaryTag}` : entry.date;
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
                image={{ ...featuredEntry.image, priority: true }}
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
                      image={entry.image}
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

export async function InsightsPageContent({
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
