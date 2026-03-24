export interface AdminInsightEditorFieldErrors {
  contentMd?: string;
  coverImage?: string;
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
  coverImageUrl: string | null;
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

export const initialAdminInsightEditorState: AdminInsightEditorState = {
  fieldErrors: {},
  message: null,
  redirectTo: null,
  status: "idle",
};

export const initialAdminInsightMediaState: AdminInsightMediaState = {
  message: null,
  snippet: null,
  uploadedUrl: null,
  status: "idle",
};
