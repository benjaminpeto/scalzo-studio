export interface AdminEditorState<TFieldErrors = object> {
  fieldErrors: TFieldErrors;
  message: string | null;
  redirectTo: string | null;
  status: "idle" | "success" | "error";
}
