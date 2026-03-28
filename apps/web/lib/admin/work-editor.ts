import type { AdminCaseStudyEditorState } from "@/interfaces/admin/work-editor";

export const initialAdminCaseStudyEditorState: AdminCaseStudyEditorState = {
  fieldErrors: {},
  message: null,
  redirectTo: null,
  status: "idle",
};
