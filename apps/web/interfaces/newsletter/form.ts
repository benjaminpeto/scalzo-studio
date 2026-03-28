export type NewsletterPlacement =
  | "home"
  | "insights-index"
  | "insights-detail"
  | "footer";

export interface SubmitNewsletterSignupState {
  status: "idle" | "error" | "success";
  message: string | null;
  fieldErrors: {
    email?: string;
  };
}
