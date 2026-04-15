import type { AdminEditorState } from "@/interfaces/admin/shared";

export interface AdminRedirectEditorFieldErrors {
  fromPath?: string;
  statusCode?: string;
  toPath?: string;
}

export type AdminRedirectEditorState =
  AdminEditorState<AdminRedirectEditorFieldErrors>;

export interface AdminRedirectEditorRecord {
  fromPath: string;
  id: string;
  statusCode: 301 | 302;
  toPath: string;
  updatedAt: string;
}

export interface AdminRedirectListItem {
  fromPath: string;
  id: string;
  statusCode: 301 | 302;
  toPath: string;
  updatedAt: string;
}

export interface AdminRedirectsListData {
  filteredCount: number;
  redirects: AdminRedirectListItem[];
  query: string;
  selectedStatusCodeFilter: "all" | "301" | "302";
  status301Count: number;
  status302Count: number;
  totalCount: number;
}
