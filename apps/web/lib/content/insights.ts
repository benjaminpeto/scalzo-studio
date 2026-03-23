import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface InsightIndexEntry {
  date: string;
  excerpt: string;
  image: string;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  tags: readonly string[];
  title: string;
}

export interface InsightHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

export interface InsightDetailPageData extends InsightIndexEntry {
  content: string;
  headings: readonly InsightHeading[];
}

type FallbackInsightArticle = Omit<InsightDetailPageData, "headings">;

const fallbackInsightArticles = [
  {
    content: `Premium service sites usually try to explain too much before they prove anything. That creates a familiar problem: the visitor is asked to process offer details before the page has created enough confidence to make those details matter.

## Proof should arrive before the long explanation

Trust is often decided in the first screen, not at the end of the copy. The first task is to show enough clarity, specificity, and taste that the rest of the page feels worth reading.

![A calmer editorial homepage direction](/placeholders/hero-editorial.svg)

If the visitor can already see what kind of business this is, who it is for, and whether it feels credible, the supporting copy starts working much harder for less effort.

## The first screen only needs to answer a few questions

Most service pages improve when the opening sequence answers these points quickly:

- What does this business actually help with?
- Why should this feel more credible than the alternatives?
- What signal makes the work feel specific instead of generic?

### Clarity is often a pacing problem

When proof is delayed, even good writing starts feeling heavier than it is. A better first screen uses hierarchy, restraint, and evidence to remove doubt earlier.

## Explanation works better once the page has earned attention

Longer copy still matters. It just performs better after the page has already made the visitor feel oriented. In practice, that means stronger proof placement, a calmer type rhythm, and fewer competing ideas in the opening sequence.`,
    date: "March 18, 2026",
    excerpt:
      "The first screen should reduce doubt quickly. Case signals, tone, and hierarchy matter before a long paragraph ever gets read.",
    image: "/placeholders/hero-editorial.svg",
    seoDescription: null,
    seoTitle: null,
    slug: "why-premium-service-brands-need-proof-before-explanation",
    tags: ["Positioning", "Trust", "Homepage strategy"],
    title: "Why premium service brands need proof before explanation",
  },
  {
    content: `A small studio site rarely needs to look bigger. It needs to feel more deliberate. Authority usually comes from restraint, from stronger spacing, and from a page structure that knows what to emphasise first.

## Established does not mean complicated

Many studio sites lose credibility by over-explaining or over-decorating. A more mature impression often comes from fewer moves, not more.

![A sharper product-led visual system](/placeholders/case-product.svg)

The first pass is usually about reducing noise: fewer competing highlights, stronger type contrast, and clearer transitions between proof, offer, and action.

## The page has to hold a stronger point of view

When every section is weighted the same, the visitor is left doing the editorial work themselves. A stronger page makes it obvious what matters most.

### Repetition creates maturity

Spacing, corner logic, image treatment, and copy pacing need to feel like they belong to one system. That repetition is what makes a small team appear established rather than improvised.

## Better structure raises the perceived level of the work

A studio site can feel more expensive before anything in the portfolio changes. The shift usually comes from pacing, hierarchy, and a better relationship between tone and proof.`,
    date: "March 09, 2026",
    excerpt:
      "A more mature homepage usually comes from restraint: fewer competing actions, stronger spacing, and clearer content bands.",
    image: "/placeholders/case-product.svg",
    seoDescription: null,
    seoTitle: null,
    slug: "how-to-make-a-small-studio-site-feel-more-established",
    tags: ["Design systems", "Authority", "Web design"],
    title: "How to make a small studio site feel more established",
  },
  {
    content: `Founders often treat content like the final layer, something to be dropped into the design once everything else is done. That usually leads to strained layouts, generic writing, and a publishing rhythm that never stabilises.

## Content needs a system, not a leftover slot

If the visual language does not help structure ideas, content becomes harder to maintain. Every new campaign, page, or launch turns into a fresh formatting problem.

![An editorial content system in use](/placeholders/case-editorial.svg)

What fixes this is not only better writing. It is a framework for how the writing, imagery, and hierarchy should land together.

## Reusable patterns remove decision fatigue

When teams know how a headline should behave, how supporting copy should sit, and what image rhythm makes sense, publishing becomes more consistent and much faster.

### The system should feel flexible, not templated

A useful content system creates continuity without flattening the brand. It gives the team enough structure to move quickly while leaving room for emphasis and variation.

## The quality of the publishing rhythm changes

Once content has a real system underneath it, it stops feeling like a burden. It becomes easier to plan, easier to review, and more likely to stay aligned with the level of the brand.`,
    date: "February 27, 2026",
    excerpt:
      "Content stops feeling secondary when the visual system gives it structure. That changes how often it gets used and maintained.",
    image: "/placeholders/case-editorial.svg",
    seoDescription: null,
    seoTitle: null,
    slug: "what-founders-miss-when-they-treat-content-like-leftovers",
    tags: ["Editorial", "Content systems", "Strategy"],
    title: "What founders miss when they treat content like leftovers",
  },
  {
    content: `A service page often fails by trying to sound comprehensive too early. The page starts with abstract claims, feature-like copy, and long explanations before it has created enough belief.

## The visitor needs proof before they need detail

The strongest service pages usually lead with a clear problem, a credible signal, and a more specific picture of what changes after the work is done.

![A calmer service-page composition](/placeholders/case-coastal.svg)

That sequence helps the visitor feel oriented. Without it, even accurate copy can feel too dense because it arrives before the page has earned attention.

## Too much explanation flattens the offer

When every paragraph carries the same weight, the offer loses shape. The page starts sounding broad instead of decisive.

### Better sequencing makes the CTA feel easier

The call to action works better when the visitor has already seen a believable problem, a believable method, and at least one believable signal of proof.

## Most pages improve by saying less, more clearly

The useful move is usually not adding more copy. It is reorganising the copy, sharpening the proof, and giving the service a more confident route from introduction to action.`,
    date: "February 11, 2026",
    excerpt:
      "Most service pages do not need more copy. They need a better sequence for proof, offer clarity, and the next step.",
    image: "/placeholders/case-coastal.svg",
    seoDescription: null,
    seoTitle: null,
    slug: "when-a-service-page-says-too-much-before-it-proves-anything",
    tags: ["Service pages", "Conversion", "Messaging"],
    title: "When a service page says too much before it proves anything",
  },
] as const satisfies readonly FallbackInsightArticle[];

export const fallbackInsightIndexEntries: readonly InsightIndexEntry[] =
  fallbackInsightArticles.map((entry) => ({
    date: entry.date,
    excerpt: entry.excerpt,
    image: entry.image,
    seoDescription: entry.seoDescription,
    seoTitle: entry.seoTitle,
    slug: entry.slug,
    tags: entry.tags,
    title: entry.title,
  }));

const fallbackInsightImage = "/placeholders/hero-editorial.svg";

function cloneFallbackInsightEntries() {
  return fallbackInsightIndexEntries.map((entry) => ({
    date: entry.date,
    excerpt: entry.excerpt,
    image: entry.image,
    seoDescription: entry.seoDescription,
    seoTitle: entry.seoTitle,
    slug: entry.slug,
    tags: [...entry.tags],
    title: entry.title,
  }));
}

export function buildInsightHeadingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdownFormatting(value: string) {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[`*_~>#-]/g, "")
    .trim();
}

export function extractInsightHeadings(content: string): InsightHeading[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^(##|###)\s+/.test(line))
    .map((line) => {
      const [, hashes = "", rawText = ""] =
        line.match(/^(##|###)\s+(.+)$/) ?? [];
      const text = stripMarkdownFormatting(rawText);

      return {
        id: buildInsightHeadingId(text),
        level: hashes.length as 2 | 3,
        text,
      };
    })
    .filter((heading) => Boolean(heading.id) && Boolean(heading.text));
}

function formatPublishedDate(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function normalizeTag(tag: string | null | undefined) {
  return tag?.trim().toLowerCase() ?? "";
}

function matchesSelectedTag(
  entry: Pick<InsightIndexEntry, "tags">,
  selectedTag: string | null,
) {
  if (!selectedTag) {
    return true;
  }

  const normalizedSelectedTag = normalizeTag(selectedTag);

  return entry.tags.some((tag) => normalizeTag(tag) === normalizedSelectedTag);
}

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildFallbackInsightContent(title: string, image: string) {
  return `A published editorial note on how clearer structure, stronger proof, and calmer visual pacing improve the first impression of ${title.toLowerCase()}.

## The core point

This article exists to turn an abstract design concern into a practical page decision.

![Article illustration](${image})

## Why it matters

The more clearly a page introduces the offer, the easier it becomes to trust the business behind it.

## What to take away

Small structural changes usually do more for credibility than simply adding more copy.`;
}

export function getFallbackInsightEntries(selectedTag: string | null = null) {
  return cloneFallbackInsightEntries().filter((entry) =>
    matchesSelectedTag(entry, selectedTag),
  );
}

export function getFallbackInsightTags() {
  return Array.from(
    new Set(
      fallbackInsightIndexEntries.flatMap((entry) =>
        entry.tags.map((tag) => tag.trim()).filter(Boolean),
      ),
    ),
  );
}

export function getFallbackInsightDetailPageData(
  slug: string,
): InsightDetailPageData {
  const fallbackEntry = fallbackInsightArticles.find(
    (entry) => entry.slug === slug,
  );

  if (fallbackEntry) {
    return {
      ...fallbackEntry,
      headings: extractInsightHeadings(fallbackEntry.content),
      tags: [...fallbackEntry.tags],
    };
  }

  const title = titleCaseFromSlug(slug);
  const content = buildFallbackInsightContent(title, fallbackInsightImage);

  return {
    content,
    date: "Editorial note",
    excerpt:
      "A published note on how sharper positioning, stronger proof, and calmer page structure improve the first impression.",
    headings: extractInsightHeadings(content),
    image: fallbackInsightImage,
    seoDescription: null,
    seoTitle: null,
    slug,
    tags: ["Editorial"],
    title,
  };
}

export async function getInsightIndexEntries(
  selectedTag: string | null = null,
) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "cover_image_url, created_at, excerpt, published_at, seo_description, seo_title, slug, tags, title, updated_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error || !data?.length) {
    return getFallbackInsightEntries(selectedTag);
  }

  return data
    .map((entry, index) => ({
      date: formatPublishedDate(
        entry.published_at ?? entry.created_at,
        fallbackInsightIndexEntries[index]?.date ?? "",
      ),
      excerpt:
        entry.excerpt ??
        fallbackInsightIndexEntries[index]?.excerpt ??
        "Editorial note on how positioning, content structure, and visual signals shape the quality of the first impression.",
      image:
        entry.cover_image_url ??
        fallbackInsightIndexEntries[index]?.image ??
        fallbackInsightImage,
      seoDescription: entry.seo_description,
      seoTitle: entry.seo_title,
      slug: entry.slug,
      tags: entry.tags?.filter((tag): tag is string =>
        Boolean(tag?.trim()),
      ) ?? [...(fallbackInsightIndexEntries[index]?.tags ?? ["Editorial"])],
      title: entry.title,
    }))
    .filter((entry) => matchesSelectedTag(entry, selectedTag));
}

export async function getInsightDetailPageData(
  slug: string,
): Promise<InsightDetailPageData | null> {
  const supabase = await createServerSupabaseClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      "content_md, cover_image_url, created_at, excerpt, published_at, seo_description, seo_title, slug, tags, title",
    )
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  const fallbackEntry = fallbackInsightArticles.find(
    (entry) => entry.slug === slug,
  );

  if ((error || !post) && !fallbackEntry) {
    return null;
  }

  const resolvedTitle =
    post?.title ?? fallbackEntry?.title ?? titleCaseFromSlug(slug);
  const resolvedImage =
    post?.cover_image_url ?? fallbackEntry?.image ?? fallbackInsightImage;
  const resolvedContent =
    post?.content_md ??
    fallbackEntry?.content ??
    buildFallbackInsightContent(resolvedTitle, resolvedImage);

  return {
    content: resolvedContent,
    date: formatPublishedDate(
      post?.published_at ?? post?.created_at ?? null,
      fallbackEntry?.date ?? "Editorial note",
    ),
    excerpt:
      post?.excerpt ??
      fallbackEntry?.excerpt ??
      "Editorial note on how positioning, content structure, and visual signals shape the quality of the first impression.",
    headings: extractInsightHeadings(resolvedContent),
    image: resolvedImage,
    seoDescription:
      post?.seo_description ?? fallbackEntry?.seoDescription ?? null,
    seoTitle: post?.seo_title ?? fallbackEntry?.seoTitle ?? null,
    slug,
    tags: post?.tags?.filter((tag): tag is string => Boolean(tag?.trim())) ?? [
      ...(fallbackEntry?.tags ?? ["Editorial"]),
    ],
    title: resolvedTitle,
  };
}

export async function getInsightTags() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("tags")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data?.length) {
    return getFallbackInsightTags();
  }

  const tags = Array.from(
    new Set(
      data.flatMap((entry) =>
        (entry.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
      ),
    ),
  );

  return tags.length ? tags : getFallbackInsightTags();
}
