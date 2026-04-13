import type { CmsImageAsset } from "@/lib/media-assets/shared";

export interface AdminCaseStudyMetricRow {
  label: string;
  value: string;
}

export interface MetricRowState extends AdminCaseStudyMetricRow {
  id: string;
}

export interface GalleryUploadRowState {
  alt: string;
  id: string;
}

export interface AdminCaseStudyEditorFieldErrors {
  approach?: string;
  challenge?: string;
  clientName?: string;
  coverImage?: string;
  coverImageAlt?: string;
  galleryImages?: string;
  galleryImageAlts?: string;
  industry?: string;
  metrics?: string;
  outcomes?: string;
  seoDescription?: string;
  seoTitle?: string;
  services?: string;
  slug?: string;
  title?: string;
}

export interface AdminCaseStudyEditorState {
  fieldErrors: AdminCaseStudyEditorFieldErrors;
  message: string | null;
  redirectTo: string | null;
  status: "idle" | "success" | "error";
}

export interface AdminCaseStudyEditorRecord {
  approach: string;
  challenge: string;
  clientName: string;
  coverImage: CmsImageAsset | null;
  galleryImages: CmsImageAsset[];
  id: string;
  industry: string;
  metrics: AdminCaseStudyMetricRow[];
  outcomes: string;
  published: boolean;
  publishedAt: string | null;
  seoDescription: string;
  seoTitle: string;
  services: string[];
  slug: string;
  title: string;
  updatedAt: string;
}

export interface AdminCaseStudyListItem {
  clientName: string | null;
  coverImageUrl: string | null;
  galleryCount: number;
  id: string;
  industry: string | null;
  published: boolean;
  slug: string;
  title: string;
  updatedAt: string;
}

export interface AdminCaseStudiesListData {
  caseStudies: AdminCaseStudyListItem[];
  draftCount: number;
  filteredCount: number;
  industries: string[];
  publishedCount: number;
  selectedIndustry: string;
  selectedPublishedFilter: "all" | "published" | "draft";
  totalCount: number;
}
