import type { CmsImageAsset } from "@/lib/media-assets/shared";

export interface AdminInsightEditorFieldErrors {
  contentMd?: string;
  coverImage?: string;
  coverImageAlt?: string;
  excerpt?: string;
  seoDescription?: string;
  seoTitle?: string;
  slug?: string;
  tags?: string;
  title?: string;
}

export interface AdminInsightEditorState {
  fieldErrors: AdminInsightEditorFieldErrors;
  message: string | null;
  redirectTo: string | null;
  status: "idle" | "success" | "error";
}

export interface AdminInsightMediaState {
  message: string | null;
  snippet: string | null;
  uploadedUrl: string | null;
  status: "idle" | "success" | "error";
}

export interface AdminInsightEditorRecord {
  contentMd: string;
  coverImage: CmsImageAsset | null;
  excerpt: string;
  id: string;
  published: boolean;
  publishedAt: string | null;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface AdminInsightListItem {
  coverImageUrl: string | null;
  excerpt: string | null;
  id: string;
  published: boolean;
  publishedAt: string | null;
  slug: string;
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface AdminInsightsListData {
  draftCount: number;
  filteredCount: number;
  posts: AdminInsightListItem[];
  publishedCount: number;
  selectedPublishedFilter: "all" | "published" | "draft";
  selectedTag: string;
  tags: string[];
  totalCount: number;
}
