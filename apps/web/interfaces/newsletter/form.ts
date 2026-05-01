import { NewsletterSignupInput } from "@/actions/newsletter/schemas";

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

export type SubscriberRow = {
  confirmation_expires_at: string | null;
  confirmation_token_hash: string | null;
  email: string;
  id: string;
  page_path: string;
  placement: NewsletterSignupInput["placement"];
  provider_contact_id: string | null;
  status: "pending" | "confirmed" | "unsubscribed";
};

export type ExistingSubscriberRow = {
  confirmation_expires_at: string | null;
  confirmation_sent_at: string | null;
  confirmed_at: string | null;
  email: string;
  id: string;
  page_path: string;
  placement: NewsletterSignupInput["placement"];
  provider_contact_id: string | null;
  status: "pending" | "confirmed" | "unsubscribed";
  unsubscribed_at: string | null;
};

export type NewsletterPersistenceErrorInput = {
  code?: string | null;
  details?: string | null;
  hint?: string | null;
  message: string;
  name: string;
};

export type PendingNewsletterSignupResult =
  | "already-subscribed"
  | "disabled"
  | "pending";

export interface NewsletterConfirmationEmailPayload {
  confirmUrl: string;
  email: string;
  expiresAt: Date;
  pagePath: string;
  placement: NewsletterSignupInput["placement"];
}

export interface NewsletterSignupProps {
  placement: NewsletterPlacement;
}
