import type { CmsImageAsset } from "@/interfaces/media-assets";

export interface WorkIndexEntry {
  description: string;
  image: CmsImageAsset;
  metadata: string;
  metric: string;
  slug: string;
  title: string;
}

export interface WorkOutcomeMetric {
  label: string;
  value: string;
}

export interface WorkDetailVisual extends CmsImageAsset {
  caption: string;
}

export interface WorkDetailTestimonial {
  company: string;
  name: string;
  quote: string;
  role: string;
}

export interface WorkDetailPageData extends WorkIndexEntry {
  approach: string;
  challenge: string;
  clientName: string | null;
  industry: string | null;
  metrics: readonly WorkOutcomeMetric[];
  outcomes: string;
  published: boolean;
  publishedAt: string | null;
  seoDescription: string | null;
  seoTitle: string | null;
  services: readonly string[];
  testimonial: WorkDetailTestimonial;
  updatedAt: string | null;
  visuals: readonly WorkDetailVisual[];
}

export interface WorkSitemapEntry {
  lastModified?: string;
  slug: string;
}
