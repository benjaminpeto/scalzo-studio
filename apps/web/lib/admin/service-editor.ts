import type { AdminServiceEditorState } from "@/interfaces/admin/service-editor";

export const initialAdminServiceEditorState: AdminServiceEditorState = {
  fieldErrors: {},
  message: null,
  redirectTo: null,
  status: "idle",
};
