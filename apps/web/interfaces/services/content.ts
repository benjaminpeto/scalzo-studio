import type { CmsImageAsset } from "@/interfaces/media-assets";

export interface ServicesIndexEntry {
  deliverables: readonly string[];
  outcome: string;
  slug: string;
  summary: string;
  title: string;
}

export interface ServicePackageOption {
  bestFor: string;
  label: string;
  summary: string;
  timeline: string;
}

export interface ServicesFaqItem {
  answer: string;
  question: string;
}

export interface ServiceDetailProcessStep {
  body: string;
  step: string;
  title: string;
}

export interface ServiceRelatedWorkItem {
  description: string;
  image: CmsImageAsset;
  metadata: string;
  outcome: string;
  title: string;
}

export interface ServiceDetailPageData extends ServicesIndexEntry {
  content: string | null;
  faq: readonly ServicesFaqItem[];
  problem: string;
  relatedWork: readonly ServiceRelatedWorkItem[];
  seoDescription: string | null;
  seoTitle: string | null;
  timeline: readonly ServiceDetailProcessStep[];
  updatedAt: string | null;
}
