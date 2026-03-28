import "server-only";

import { serverFeatureFlags } from "@/lib/env/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

import {
  buildNewsletterConfirmationEmailPayload,
  sendNewsletterConfirmationEmail,
} from "./newsletter-emails";
import {
  createNewsletterConfirmationToken,
  hashNewsletterToken,
} from "./helpers";
import type { NewsletterSignupInput } from "./schemas";

type ExistingSubscriberRow = {
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

type NewsletterPersistenceErrorInput = {
  code?: string | null;
  details?: string | null;
  hint?: string | null;
  message: string;
  name: string;
};

class NewsletterPersistenceError extends Error {
  code: string | null;
  details: string | null;
  hint: string | null;

  constructor(input: NewsletterPersistenceErrorInput) {
    super(input.message);

    this.name = input.name;
    this.code = input.code ?? null;
    this.details = input.details ?? null;
    this.hint = input.hint ?? null;
  }
}

function createPersistenceError(
  name: NewsletterPersistenceErrorInput["name"],
  error: {
    code?: string | null;
    details?: string | null;
    hint?: string | null;
    message: string;
  },
) {
  return new NewsletterPersistenceError({
    code: error.code,
    details: error.details,
    hint: error.hint,
    message: error.message,
    name,
  });
}

export type PendingNewsletterSignupResult =
  | "already-subscribed"
  | "disabled"
  | "pending";

export async function createOrRefreshPendingNewsletterSignup(
  input: NewsletterSignupInput,
): Promise<PendingNewsletterSignupResult> {
  if (!serverFeatureFlags.newsletterSignupEnabled) {
    return "disabled";
  }

  const supabase = createServiceRoleSupabaseClient();
  const { data: existingRow, error: existingRowError } = await supabase
    .from("newsletter_subscribers")
    .select(
      "confirmation_expires_at, confirmation_sent_at, confirmed_at, email, id, page_path, placement, provider_contact_id, status, unsubscribed_at",
    )
    .ilike("email", input.email)
    .maybeSingle<ExistingSubscriberRow>();

  if (existingRowError) {
    throw createPersistenceError(
      "NewsletterSignupLookupError",
      existingRowError,
    );
  }

  if (existingRow?.status === "confirmed") {
    const { error: confirmedUpdateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        page_path: input.pagePath,
        placement: input.placement,
      })
      .eq("id", existingRow.id);

    if (confirmedUpdateError) {
      throw createPersistenceError(
        "NewsletterSignupUpdateError",
        confirmedUpdateError,
      );
    }

    return "already-subscribed";
  }

  const token = createNewsletterConfirmationToken();
  const emailPayload = buildNewsletterConfirmationEmailPayload({
    email: input.email,
    pagePath: input.pagePath,
    placement: input.placement,
    token,
  });
  const tokenHash = hashNewsletterToken(token);

  if (existingRow) {
    const { error: pendingUpdateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        confirmation_expires_at: emailPayload.expiresAt.toISOString(),
        confirmation_sent_at: new Date().toISOString(),
        confirmation_token_hash: tokenHash,
        confirmed_at: null,
        page_path: input.pagePath,
        placement: input.placement,
        provider: "resend",
        provider_contact_id:
          existingRow.status === "pending"
            ? existingRow.provider_contact_id
            : null,
        status: "pending",
        unsubscribed_at: null,
      })
      .eq("id", existingRow.id);

    if (pendingUpdateError) {
      throw createPersistenceError(
        "NewsletterSignupUpdateError",
        pendingUpdateError,
      );
    }
  } else {
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        confirmation_expires_at: emailPayload.expiresAt.toISOString(),
        confirmation_sent_at: new Date().toISOString(),
        confirmation_token_hash: tokenHash,
        email: input.email,
        page_path: input.pagePath,
        placement: input.placement,
        provider: "resend",
        status: "pending",
      });

    if (insertError) {
      throw createPersistenceError("NewsletterSignupInsertError", insertError);
    }
  }

  await sendNewsletterConfirmationEmail(emailPayload);

  return "pending";
}
