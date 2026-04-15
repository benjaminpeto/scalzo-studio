import type {
  AdminLeadEditorFieldErrors,
  AdminLeadEditorState,
} from "@/interfaces/admin/lead-editor";
import { createEditorActionStateBuilders } from "@/actions/admin/shared/helpers";

const leadActionStateBuilders = createEditorActionStateBuilders<
  AdminLeadEditorFieldErrors,
  AdminLeadEditorState
>();

export const initialAdminLeadEditorState: AdminLeadEditorState = {
  fieldErrors: {},
  message: null,
  redirectTo: null,
  status: "idle",
};

export const createActionErrorState =
  leadActionStateBuilders.createActionErrorState;
export const createActionSuccessState =
  leadActionStateBuilders.createActionSuccessState;
