export interface AdminServiceEditorFieldErrors {
  contentMd?: string;
  deliverables?: string;
  seoDescription?: string;
  seoTitle?: string;
  slug?: string;
  summary?: string;
  title?: string;
}

export interface AdminServiceEditorState {
  fieldErrors: AdminServiceEditorFieldErrors;
  message: string | null;
  redirectTo: string | null;
  status: "idle" | "success" | "error";
}

export interface AdminServiceEditorRecord {
  contentMd: string;
  deliverables: string[];
  id: string;
  orderIndex: number;
  published: boolean;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  summary: string;
  title: string;
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
