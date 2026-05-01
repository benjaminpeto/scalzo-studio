import { serverFeatureFlags } from "@/lib/env/server";
import { recordWatchdogEvent } from "@/lib/watchdog/server";
import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";
import type {
  QuoteRequestLogContext,
  QuoteRequestWatchdogContext,
} from "@/interfaces/contact/quote-request";
import { getContactPublicContent } from "@/constants/contact/public-content";

import { serializeErrorForLog } from "./helpers";
import { createQuoteRequestErrorState } from "./submit-quote-request-input";
import { verifyHCaptchaToken } from "./verify-hcaptcha";

export async function getQuoteRequestAvailabilityState(input: {
  locale: string;
  logContext: QuoteRequestLogContext;
  watchdogContext: QuoteRequestWatchdogContext;
}): Promise<SubmitQuoteRequestState | null> {
  const messages = getContactPublicContent(input.locale).errors;

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

    return createQuoteRequestErrorState({ message: messages.formUnavailable });
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

    return createQuoteRequestErrorState({ message: messages.formUnavailable });
  }

  return null;
}

export async function validateQuoteRequestCaptcha(input: {
  hCaptchaToken: string;
  locale: string;
  logContext: QuoteRequestLogContext;
  watchdogContext: QuoteRequestWatchdogContext;
}): Promise<SubmitQuoteRequestState | null> {
  const messages = getContactPublicContent(input.locale).errors;

  if (!input.hCaptchaToken) {
    return createQuoteRequestErrorState({
      captchaError: messages.captchaRequired,
      message: messages.captchaRetry,
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
      captchaError: messages.captchaRequired,
      message: messages.captchaRetry,
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
      captchaError: messages.captchaUnavailable,
      message: messages.requestUnverified,
    });
  }
}
