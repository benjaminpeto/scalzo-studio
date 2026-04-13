import { ArrowUpRight } from "lucide-react";

import {
  HoverCard,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";
import type { JournalEntry } from "@/components/home/content";
import { BlogPostCard } from "@ui/components/marketing/blog-post-card";

export function JournalPreview({
  entries,
}: {
  entries: ReadonlyArray<JournalEntry>;
}) {
  const [featuredEntry, ...supportingEntries] = entries;

  return (
    <section
      id="journal"
      className="section-shell anchor-offset py-20 lg:py-28"
    >
      <Reveal>
        <ScrollFloat className="mb-12" offset={28}>
          <TextReveal>
            <h2 className="font-display text-[3.1rem] leading-[0.92] tracking-[-0.06em] text-foreground sm:text-[4.2rem] lg:text-[5.2rem]">
              Notre Journal<span className="text-primary">.</span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.08}>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-foreground">
              Insights on branding, strategy, and digital direction.
            </p>
          </TextReveal>
        </ScrollFloat>

        <RevealGroup
          className="grid gap-5 lg:grid-cols-[1.1fr_0.55fr_0.55fr]"
          stagger={0.12}
        >
          <RevealItem>
            <ScrollFloat offset={20}>
              <HoverCard className="h-full">
                <BlogPostCard
                  title={featuredEntry.title}
                  variant="featured"
                  metadata={featuredEntry.date}
                  excerpt={featuredEntry.excerpt}
                  image={featuredEntry.image}
                  cta={{
                    href: `/insights/${featuredEntry.slug}`,
                    label: "Read article",
                  }}
                />
              </HoverCard>
            </ScrollFloat>
          </RevealItem>

          {supportingEntries.map((entry) => (
            <RevealItem key={entry.title}>
              <ScrollFloat offset={16}>
                <HoverCard className="h-full">
                  <BlogPostCard
                    title={entry.title}
                    metadata={entry.date}
                    excerpt={entry.excerpt}
                    image={entry.image}
                    cta={{
                      href: `/insights/${entry.slug}`,
                      label: (
                        <span className="inline-flex items-center gap-2">
                          Read article
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </span>
                      ),
                    }}
                  />
                </HoverCard>
              </ScrollFloat>
            </RevealItem>
          ))}
        </RevealGroup>
      </Reveal>
    </section>
  );
}
