"use server";

import "server-only";

import { serverEnv, serverFeatureFlags } from "@/lib/env/server";
import { createOrUpdateResendContactWithTopic } from "@/lib/resend/client";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { captureServerEvent } from "@/lib/analytics/server";

import {
  buildNewsletterConfirmedPath,
  buildNewsletterSignupLogContext,
  hashNewsletterToken,
  normalizeEmail,
} from "./helpers";
import { SubscriberRow } from "@/interfaces/newsletter/form";

export async function handleNewsletterConfirmRequest(input: {
  email?: string | null;
  token?: string | null;
}) {
  const email = normalizeEmail(input.email);
  const token = input.token?.trim();

  if (!email || !token) {
    return buildNewsletterConfirmedPath("invalid");
  }

  const logContext = buildNewsletterSignupLogContext({
    email,
    pagePath: "/newsletter/confirm",
    placement: null,
  });

  if (!serverFeatureFlags.newsletterSignupEnabled) {
    console.error(
      "Newsletter confirmation skipped because the integration is disabled",
      logContext,
    );
    return buildNewsletterConfirmedPath("error");
  }

  const supabase = createServiceRoleSupabaseClient();
  const { data: subscriber, error: subscriberError } = await supabase
    .from("newsletter_subscribers")
    .select(
      "confirmation_expires_at, confirmation_token_hash, email, id, page_path, placement, provider_contact_id, status",
    )
    .ilike("email", email)
    .maybeSingle<SubscriberRow>();

  if (subscriberError) {
    console.error("Newsletter confirmation lookup failed", {
      ...logContext,
      code: subscriberError.code,
      details: subscriberError.details,
      hint: subscriberError.hint,
      message: subscriberError.message,
    });

    return buildNewsletterConfirmedPath("error");
  }

  if (!subscriber) {
    return buildNewsletterConfirmedPath("invalid");
  }

  if (subscriber.status === "confirmed") {
    return buildNewsletterConfirmedPath("confirmed");
  }

  if (!subscriber.confirmation_token_hash) {
    return buildNewsletterConfirmedPath("invalid");
  }

  if (subscriber.confirmation_token_hash !== hashNewsletterToken(token)) {
    return buildNewsletterConfirmedPath("invalid");
  }

  if (
    subscriber.confirmation_expires_at &&
    new Date(subscriber.confirmation_expires_at).getTime() < Date.now()
  ) {
    return buildNewsletterConfirmedPath("expired");
  }

  try {
    const providerContactId = await createOrUpdateResendContactWithTopic({
      email: subscriber.email,
      topicId: serverEnv.resendNewsletterTopicId!,
    });

    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        confirmation_expires_at: null,
        confirmation_token_hash: null,
        confirmed_at: new Date().toISOString(),
        provider_contact_id: providerContactId,
        status: "confirmed",
        unsubscribed_at: null,
      })
      .eq("id", subscriber.id);

    if (updateError) {
      console.error("Newsletter confirmation state update failed", {
        ...logContext,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
        message: updateError.message,
      });

      return buildNewsletterConfirmedPath("error");
    }

    await captureServerEvent(
      subscriber.email,
      "newsletter_confirmed",
      {
        page_path: subscriber.page_path,
        placement: subscriber.placement,
      },
      {
        pagePath: subscriber.page_path,
      },
    );

    return buildNewsletterConfirmedPath("confirmed");
  } catch (error) {
    console.error("Newsletter provider sync failed", {
      ...logContext,
      error:
        error instanceof Error
          ? { message: error.message, name: error.name }
          : { value: String(error) },
    });

    return buildNewsletterConfirmedPath("error");
  }
}
