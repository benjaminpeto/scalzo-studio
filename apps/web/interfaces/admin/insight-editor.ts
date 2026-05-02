import type { CmsImageAsset } from "@/interfaces/media-assets";
import type { AdminEditorState } from "@/interfaces/admin/shared";

export interface AdminInsightEditorFieldErrors {
  contentMd?: string;
  contentMdEs?: string;
  coverImage?: string;
  coverImageAlt?: string;
  excerpt?: string;
  excerptEs?: string;
  seoDescription?: string;
  seoDescriptionEs?: string;
  seoTitle?: string;
  seoTitleEs?: string;
  slug?: string;
  tags?: string;
  title?: string;
  titleEs?: string;
}

export type AdminInsightEditorState =
  AdminEditorState<AdminInsightEditorFieldErrors>;

export interface AdminInsightMediaState {
  message: string | null;
  snippet: string | null;
  uploadedUrl: string | null;
  status: "idle" | "success" | "error";
}

export interface AdminInsightEditorRecord {
  contentMd: string;
  contentMdEs: string;
  coverImage: CmsImageAsset | null;
  excerpt: string;
  excerptEs: string;
  id: string;
  published: boolean;
  publishedAt: string | null;
  seoDescription: string;
  seoDescriptionEs: string;
  seoTitle: string;
  seoTitleEs: string;
  slug: string;
  tags: string[];
  title: string;
  titleEs: string;
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
