import type {
  AdminLeadEditorFieldErrors,
  AdminLeadEditorState,
} from "@/interfaces/admin/lead-editor";

export const initialAdminLeadEditorState: AdminLeadEditorState = {
  fieldErrors: {},
  message: null,
  redirectTo: null,
  status: "idle",
};

export function createActionErrorState(
  message: string,
  fieldErrors: AdminLeadEditorFieldErrors = {},
): AdminLeadEditorState {
  return {
    fieldErrors,
    message,
    redirectTo: null,
    status: "error",
  };
}

export function createActionSuccessState(input: {
  message: string;
  redirectTo: string;
}): AdminLeadEditorState {
  return {
    fieldErrors: {},
    message: input.message,
    redirectTo: input.redirectTo,
    status: "success",
  };
}
