"use server";

import { newsletterSignupContent } from "@/constants/newsletter/content";
import type { SubmitNewsletterSignupState } from "@/interfaces/newsletter/form";

import { createOrRefreshPendingNewsletterSignup } from "./create-or-refresh-pending-newsletter-signup";
import {
  buildNewsletterFieldErrors,
  buildNewsletterSignupLogContext,
  serializeNewsletterErrorForLog,
} from "./helpers";
import { getNewsletterConfirmationMessage } from "./newsletter-emails";
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

  try {
    const result = await createOrRefreshPendingNewsletterSignup(
      parsedInput.data,
    );

    if (result === "disabled") {
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

    if (result === "already-subscribed") {
      return {
        fieldErrors: {},
        message: newsletterSignupContent.states.alreadySubscribed,
        status: "success",
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
