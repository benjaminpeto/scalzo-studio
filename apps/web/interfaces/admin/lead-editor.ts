export interface AdminLeadEditorRecord {
  budgetBand: string | null;
  company: string | null;
  createdAt: string;
  email: string | null;
  id: string;
  internalNotes: string | null;
  message: string | null;
  name: string | null;
  pagePath: string | null;
  servicesInterest: string[];
  sourceUtm: Record<string, string> | null;
  status: string;
  timelineBand: string | null;
  website: string | null;
}

export interface AdminLeadEditorFieldErrors {
  internalNotes?: string;
  status?: string;
}

export interface AdminLeadEditorState {
  fieldErrors: AdminLeadEditorFieldErrors;
  message: string | null;
  redirectTo: string | null;
  status: "idle" | "success" | "error";
}
