"use server";

import { newsletterSignupContent } from "@/constants/newsletter/content";
import { serverFeatureFlags } from "@/lib/env/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import type { SubmitNewsletterSignupState } from "@/interfaces/newsletter/form";

import {
  buildNewsletterFieldErrors,
  buildNewsletterSignupLogContext,
  createNewsletterConfirmationToken,
  hashNewsletterToken,
  serializeNewsletterErrorForLog,
} from "./helpers";
import {
  buildNewsletterConfirmationEmailPayload,
  getNewsletterConfirmationMessage,
  sendNewsletterConfirmationEmail,
} from "./newsletter-emails";
import { newsletterSignupSchema } from "./schemas";

type ExistingSubscriberRow = {
  confirmation_expires_at: string | null;
  confirmation_sent_at: string | null;
  confirmed_at: string | null;
  email: string;
  id: string;
  page_path: string;
  placement: "home" | "insights-index" | "insights-detail" | "footer";
  provider_contact_id: string | null;
  status: "pending" | "confirmed" | "unsubscribed";
  unsubscribed_at: string | null;
};

export async function submitNewsletterSignup(
  _prevState: SubmitNewsletterSignupState,
  formData: FormData,
): Promise<SubmitNewsletterSignupState> {
  const parsedInput = newsletterSignupSchema.safeParse({
    email: formData.get("email"),
    pagePath: formData.get("pagePath"),
    placement: formData.get("placement"),
  });

  const rawEmail = formData.get("email");
  const rawPagePath = formData.get("pagePath");
  const rawPlacement = formData.get("placement");
  const logContext = buildNewsletterSignupLogContext({
    email: typeof rawEmail === "string" ? rawEmail : null,
    pagePath: typeof rawPagePath === "string" ? rawPagePath : null,
    placement: typeof rawPlacement === "string" ? rawPlacement : null,
  });

  if (!parsedInput.success) {
    return {
      fieldErrors: buildNewsletterFieldErrors(parsedInput.error),
      message: "Enter a valid email address to join the newsletter.",
      status: "error",
    };
  }

  if (!serverFeatureFlags.newsletterSignupEnabled) {
    console.error(
      "Newsletter signup skipped because the integration is disabled",
      logContext,
    );

    return {
      fieldErrors: {},
      message: newsletterSignupContent.states.emailUnavailable,
      status: "error",
    };
  }

  try {
    const input = parsedInput.data;
    const supabase = createServiceRoleSupabaseClient();
    const { data: existingRow, error: existingRowError } = await supabase
      .from("newsletter_subscribers")
      .select(
        "confirmation_expires_at, confirmation_sent_at, confirmed_at, email, id, page_path, placement, provider_contact_id, status, unsubscribed_at",
      )
      .ilike("email", input.email)
      .maybeSingle<ExistingSubscriberRow>();

    if (existingRowError) {
      console.error("Newsletter signup lookup failed", {
        ...logContext,
        code: existingRowError.code,
        details: existingRowError.details,
        hint: existingRowError.hint,
        message: existingRowError.message,
      });

      return {
        fieldErrors: {},
        message: newsletterSignupContent.states.providerError,
        status: "error",
      };
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
        console.error("Newsletter signup confirmed-row update failed", {
          ...logContext,
          code: confirmedUpdateError.code,
          details: confirmedUpdateError.details,
          hint: confirmedUpdateError.hint,
          message: confirmedUpdateError.message,
        });
      }

      return {
        fieldErrors: {},
        message: newsletterSignupContent.states.alreadySubscribed,
        status: "success",
      };
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
        console.error("Newsletter signup pending-row update failed", {
          ...logContext,
          code: pendingUpdateError.code,
          details: pendingUpdateError.details,
          hint: pendingUpdateError.hint,
          message: pendingUpdateError.message,
        });

        return {
          fieldErrors: {},
          message: newsletterSignupContent.states.providerError,
          status: "error",
        };
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
        console.error("Newsletter signup insert failed", {
          ...logContext,
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
          message: insertError.message,
        });

        return {
          fieldErrors: {},
          message: newsletterSignupContent.states.providerError,
          status: "error",
        };
      }
    }

    try {
      await sendNewsletterConfirmationEmail(emailPayload);
    } catch (error) {
      console.error("Newsletter confirmation email send failed", {
        ...logContext,
        error: serializeNewsletterErrorForLog(error),
      });

      return {
        fieldErrors: {},
        message: newsletterSignupContent.states.providerError,
        status: "error",
      };
    }

    return {
      fieldErrors: {},
      message: getNewsletterConfirmationMessage(),
      status: "success",
    };
  } catch (error) {
    console.error("Newsletter signup threw an unexpected error", {
      ...logContext,
      error: serializeNewsletterErrorForLog(error),
    });

    return {
      fieldErrors: {},
      message: newsletterSignupContent.states.providerError,
      status: "error",
    };
  }
}
