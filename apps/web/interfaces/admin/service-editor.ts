import type { AdminEditorState } from "@/interfaces/admin/shared";

export interface AdminServiceEditorFieldErrors {
  contentMd?: string;
  contentMdEs?: string;
  deliverables?: string;
  seoDescription?: string;
  seoDescriptionEs?: string;
  seoTitle?: string;
  seoTitleEs?: string;
  slug?: string;
  summary?: string;
  summaryEs?: string;
  title?: string;
  titleEs?: string;
}

export type AdminServiceEditorState =
  AdminEditorState<AdminServiceEditorFieldErrors>;

export interface AdminServiceEditorRecord {
  contentMd: string;
  contentMdEs: string;
  deliverables: string[];
  id: string;
  orderIndex: number;
  published: boolean;
  seoDescription: string;
  seoDescriptionEs: string;
  seoTitle: string;
  seoTitleEs: string;
  slug: string;
  summary: string;
  summaryEs: string;
  title: string;
  titleEs: string;
  updatedAt: string;
}

export interface AdminServiceListItem {
  deliverablesCount: number;
  id: string;
  orderIndex: number;
  published: boolean;
  slug: string;
  summary: string | null;
  title: string;
  updatedAt: string;
}

export interface AdminServicesListData {
  draftCount: number;
  filteredCount: number;
  publishedCount: number;
  query: string;
  services: AdminServiceListItem[];
  totalCount: number;
}
