import type { InsightHeading } from "@/lib/insights/markdown";

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

export interface InsightDetailPageData extends InsightIndexEntry {
  content: string;
  headings: readonly InsightHeading[];
  published: boolean;
}
