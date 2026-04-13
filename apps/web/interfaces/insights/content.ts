import type { InsightHeading } from "@/lib/insights/markdown";
import type { CmsImageAsset } from "@/lib/media-assets/shared";

export interface InsightIndexEntry {
  date: string;
  excerpt: string;
  image: CmsImageAsset;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  tags: readonly string[];
  title: string;
}

export interface InsightDetailPageData extends InsightIndexEntry {
  content: string;
  contentImages: Record<string, CmsImageAsset>;
  headings: readonly InsightHeading[];
  published: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
}
