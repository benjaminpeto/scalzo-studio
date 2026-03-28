import type { contactFieldStepMap } from "@/constants/contact/content";

export type ContactFieldName = keyof typeof contactFieldStepMap;

export interface SubmitQuoteRequestState {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: Partial<Record<ContactFieldName, string>>;
}
