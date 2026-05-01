"use server";

import { getNewsletterPublicContent } from "@/constants/newsletter/public-content";
import type { SubmitNewsletterSignupState } from "@/interfaces/newsletter/form";
import { serverFeatureFlags } from "@/lib/env/server";
import { recordWatchdogEvent } from "@/lib/watchdog/server";

import { createOrRefreshPendingNewsletterSignup } from "./create-or-refresh-pending-newsletter-signup";
import {
  buildNewsletterFieldErrors,
  buildNewsletterSignupLogContext,
  serializeNewsletterErrorForLog,
} from "./helpers";
import { newsletterSignupSchema } from "./schemas";

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
  const rawLocale = formData.get("locale");
  const rawPagePath = formData.get("pagePath");
  const rawPlacement = formData.get("placement");
  const locale =
    typeof rawLocale === "string" && (rawLocale === "en" || rawLocale === "es")
      ? rawLocale
      : "en";
  const messages = getNewsletterPublicContent(locale).states;
  const logContext = buildNewsletterSignupLogContext({
    email: typeof rawEmail === "string" ? rawEmail : null,
    pagePath: typeof rawPagePath === "string" ? rawPagePath : null,
    placement: typeof rawPlacement === "string" ? rawPlacement : null,
  });
  const watchdogContext = {
    emailDomain: logContext.emailDomain,
    newsletterSignupEnabled: serverFeatureFlags.newsletterSignupEnabled,
    pagePath: logContext.pagePath,
    placement: logContext.placement,
    serviceRoleEnabled: serverFeatureFlags.serviceRoleEnabled,
  };

  if (!parsedInput.success) {
    const fieldErrors = buildNewsletterFieldErrors(parsedInput.error);

    if (fieldErrors.email) {
      fieldErrors.email = messages.invalidEmail;
    }

    return {
      fieldErrors,
      message: messages.invalidEmail,
      status: "error",
    };
  }

  try {
    const result = await createOrRefreshPendingNewsletterSignup(
      parsedInput.data,
    );

    if (result === "disabled") {
      console.error(
        "Newsletter signup skipped because the integration is disabled",
        logContext,
      );
      await recordWatchdogEvent({
        context: watchdogContext,
        reason: "integration_disabled",
        source: "newsletter_signup",
        status: "error",
      });

      return {
        fieldErrors: {},
        message: messages.emailUnavailable,
        status: "error",
      };
    }

    if (result === "already-subscribed") {
      await recordWatchdogEvent({
        context: watchdogContext,
        reason: "already_subscribed",
        source: "newsletter_signup",
        status: "success",
      });

      return {
        fieldErrors: {},
        message: messages.alreadySubscribed,
        status: "success",
      };
    }

    await recordWatchdogEvent({
      context: watchdogContext,
      reason: "submitted",
      source: "newsletter_signup",
      status: "success",
    });

    return {
      fieldErrors: {},
      message: messages.pending,
      status: "success",
    };
  } catch (error) {
    console.error("Newsletter signup threw an unexpected error", {
      ...logContext,
      error: serializeNewsletterErrorForLog(error),
    });
    await recordWatchdogEvent({
      context: {
        ...watchdogContext,
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
      reason: "request_failed",
      source: "newsletter_signup",
      status: "error",
    });

    return {
      fieldErrors: {},
      message: messages.providerError,
      status: "error",
    };
  }
}
