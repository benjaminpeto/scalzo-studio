import { serverFeatureFlags } from "@/lib/env/server";
import { recordWatchdogEvent } from "@/lib/watchdog/server";
import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";
import type {
  QuoteRequestLogContext,
  QuoteRequestWatchdogContext,
} from "@/interfaces/contact/quote-request";

import { serializeErrorForLog } from "./helpers";
import { createQuoteRequestErrorState } from "./submit-quote-request-input";
import { verifyHCaptchaToken } from "./verify-hcaptcha";

const unavailableMessage =
  "The contact form is temporarily unavailable. Email hello@scalzostudio.com instead.";

export async function getQuoteRequestAvailabilityState(input: {
  logContext: QuoteRequestLogContext;
  watchdogContext: QuoteRequestWatchdogContext;
}): Promise<SubmitQuoteRequestState | null> {
  if (!serverFeatureFlags.serviceRoleEnabled) {
    console.error(
      "Quote request submission skipped because service-role access is disabled",
      input.logContext,
    );
    await recordWatchdogEvent({
      context: input.watchdogContext,
      reason: "service_role_disabled",
      source: "quote_request",
      status: "error",
    });

    return createQuoteRequestErrorState({ message: unavailableMessage });
  }

  if (!serverFeatureFlags.hcaptchaEnabled) {
    console.error(
      "Quote request submission skipped because hCaptcha is disabled",
      input.logContext,
    );
    await recordWatchdogEvent({
      context: input.watchdogContext,
      reason: "hcaptcha_disabled",
      source: "quote_request",
      status: "error",
    });

    return createQuoteRequestErrorState({ message: unavailableMessage });
  }

  return null;
}

export async function validateQuoteRequestCaptcha(input: {
  hCaptchaToken: string;
  logContext: QuoteRequestLogContext;
  watchdogContext: QuoteRequestWatchdogContext;
}): Promise<SubmitQuoteRequestState | null> {
  if (!input.hCaptchaToken) {
    return createQuoteRequestErrorState({
      captchaError: "Complete the hCaptcha check before submitting.",
      message: "Complete the anti-spam check and try again.",
    });
  }

  try {
    const verification = await verifyHCaptchaToken(input.hCaptchaToken);

    if (verification.success) {
      return null;
    }

    console.error("Quote request hCaptcha verification failed", {
      ...input.logContext,
      challengeTimestamp: verification.challengeTimestamp,
      errorCodes: verification.errorCodes,
      hasHostname: verification.hasHostname,
      hasRemoteIp: verification.hasRemoteIp,
      hasUserAgent: verification.hasUserAgent,
    });

    return createQuoteRequestErrorState({
      captchaError: "Complete the hCaptcha check before submitting.",
      message: "Complete the anti-spam check and try again.",
    });
  } catch (error) {
    console.error("Quote request hCaptcha verification errored", {
      ...input.logContext,
      error: serializeErrorForLog(error),
    });
    await recordWatchdogEvent({
      context: {
        ...input.watchdogContext,
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
      reason: "hcaptcha_verification_error",
      source: "quote_request",
      status: "error",
    });

    return createQuoteRequestErrorState({
      captchaError: "The anti-spam check could not be verified. Try again.",
      message:
        "The request could not be verified right now. Please try again or email hello@scalzostudio.com.",
    });
  }
}
