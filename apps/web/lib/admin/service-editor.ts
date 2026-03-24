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

export const initialAdminServiceEditorState: AdminServiceEditorState = {
  fieldErrors: {},
  message: null,
  redirectTo: null,
  status: "idle",
};
