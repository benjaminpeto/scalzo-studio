import type {
  AdminInsightEditorState,
  AdminInsightMediaState,
} from "@/interfaces/admin/insight-editor";

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

interface InsertInsightSnippetInput {
  content: string;
  selectionEnd?: number;
  selectionStart?: number;
  snippet: string;
}

export function insertInsightSnippet({
  content,
  selectionEnd = content.length,
  selectionStart = content.length,
  snippet,
}: InsertInsightSnippetInput) {
  const prefix = content.slice(0, selectionStart);
  const suffix = content.slice(selectionEnd);
  const needsLeadingBreak = prefix.length > 0 && !prefix.endsWith("\n\n");
  const leading = needsLeadingBreak ? "\n\n" : "";
  const needsTrailingBreak =
    suffix.length > 0 && !suffix.startsWith("\n\n") ? "\n\n" : "";

  return `${prefix}${leading}${snippet}${needsTrailingBreak}${suffix}`;
}
