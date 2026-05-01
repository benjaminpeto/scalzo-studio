"use server";

import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";

import {
  getQuoteRequestAvailabilityState,
  validateQuoteRequestCaptcha,
} from "./submit-quote-request-guards";
import { prepareQuoteRequestSubmission } from "./submit-quote-request-input";
import { submitValidatedQuoteRequest } from "./submit-quote-request-submission";

export async function submitQuoteRequest(
  _prevState: SubmitQuoteRequestState,
  formData: FormData,
): Promise<SubmitQuoteRequestState> {
  const preparedSubmission = prepareQuoteRequestSubmission(formData);

  if ("state" in preparedSubmission && preparedSubmission.state) {
    console.error("Quote request validation failed", {
      ...preparedSubmission.logContext,
      fieldErrors: preparedSubmission.validationIssueFields,
    });

    return preparedSubmission.state;
  }

  const availabilityState = await getQuoteRequestAvailabilityState({
    locale: preparedSubmission.locale,
    logContext: preparedSubmission.logContext,
    watchdogContext: preparedSubmission.watchdogContext,
  });

  if (availabilityState) {
    return availabilityState;
  }

  const captchaState = await validateQuoteRequestCaptcha({
    hCaptchaToken: preparedSubmission.hCaptchaToken,
    locale: preparedSubmission.locale,
    logContext: preparedSubmission.logContext,
    watchdogContext: preparedSubmission.watchdogContext,
  });

  if (captchaState) {
    return captchaState;
  }

  return submitValidatedQuoteRequest({
    input: preparedSubmission.input,
    locale: preparedSubmission.locale,
    logContext: preparedSubmission.logContext,
    newsletterOptIn: preparedSubmission.newsletterOptIn,
    watchdogContext: preparedSubmission.watchdogContext,
  });
}
