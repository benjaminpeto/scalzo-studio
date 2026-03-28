import type { AdminRedirectEditorState } from "@/interfaces/admin/redirect-editor";

export const initialAdminRedirectEditorState: AdminRedirectEditorState = {
  fieldErrors: {},
  message: null,
  redirectTo: null,
  status: "idle",
};
