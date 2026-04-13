export interface WorkIndexEntry {
  description: string;
  image: string;
  metadata: string;
  metric: string;
  slug: string;
  title: string;
}

export interface WorkOutcomeMetric {
  label: string;
  value: string;
}

export interface WorkDetailVisual {
  alt: string;
  caption: string;
  src: string;
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
