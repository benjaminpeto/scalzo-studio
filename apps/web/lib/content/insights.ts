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

export const fallbackInsightIndexEntries = [
  {
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
] as const satisfies readonly InsightIndexEntry[];

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
