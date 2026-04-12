"use server";

import { serverFeatureFlags } from "@/lib/env/server";
import type { Database } from "@/lib/supabase/database.types";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { recordWatchdogEvent } from "@/lib/watchdog/server";
import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";
import { createOrRefreshPendingNewsletterSignup } from "@/actions/newsletter/create-or-refresh-pending-newsletter-signup";
import { captureServerEvent } from "@/lib/analytics/server";
import {
  buildNewsletterSignupLogContext,
  serializeNewsletterErrorForLog,
} from "@/actions/newsletter/helpers";

import {
  buildQuoteRequestLogContext,
  buildFieldErrors,
  buildLeadMessage,
  normalizeString,
  readLeadFormData,
  serializeErrorForLog,
} from "./helpers";
import { verifyHCaptchaToken } from "./verify-hcaptcha";
import {
  buildQuoteRequestEmailLogContext,
  buildQuoteRequestEmailPayload,
  sendQuoteRequestEmails,
  serializeQuoteRequestEmailErrorForLog,
} from "./quote-request-emails";
import { contactLeadSchema } from "./schemas";

function getEmailDomain(value: string | null) {
  return value && value.includes("@") ? (value.split("@")[1] ?? null) : null;
}

export async function submitQuoteRequest(
  _prevState: SubmitQuoteRequestState,
  formData: FormData,
): Promise<SubmitQuoteRequestState> {
  const rawInput = readLeadFormData(formData);
  const email = normalizeString(rawInput.email);
  const pagePath = normalizeString(rawInput.pagePath) || "/contact";
  const emailDomain = getEmailDomain(email);
  const watchdogContext = {
    emailDomain,
    hcaptchaEnabled: serverFeatureFlags.hcaptchaEnabled,
    pagePath,
    serviceRoleEnabled: serverFeatureFlags.serviceRoleEnabled,
  };
  const logContext = buildQuoteRequestLogContext({
    budgetBand: normalizeString(rawInput.budgetBand),
    newsletterOptIn: normalizeString(rawInput.newsletterOptIn) === "true",
    pagePath,
    projectType: normalizeString(rawInput.projectType),
    referrer: normalizeString(rawInput.referrer),
    servicesInterest: rawInput.servicesInterest.filter(
      (entry): entry is string => typeof entry === "string" && Boolean(entry),
    ),
    timelineBand: normalizeString(rawInput.timelineBand),
    utmCampaign: normalizeString(rawInput.utmCampaign),
    utmContent: normalizeString(rawInput.utmContent),
    utmMedium: normalizeString(rawInput.utmMedium),
    utmSource: normalizeString(rawInput.utmSource),
    utmTerm: normalizeString(rawInput.utmTerm),
    website: normalizeString(rawInput.website),
  });

  const parsedInput = contactLeadSchema.safeParse({
    budgetBand: normalizeString(rawInput.budgetBand),
    company: normalizeString(rawInput.company),
    consent: normalizeString(rawInput.consent),
    email,
    location: normalizeString(rawInput.location),
    message: normalizeString(rawInput.message),
    name: normalizeString(rawInput.name),
    pagePath,
    primaryGoal: normalizeString(rawInput.primaryGoal),
    projectType: normalizeString(rawInput.projectType),
    referrer: normalizeString(rawInput.referrer),
    servicesInterest: rawInput.servicesInterest.filter(
      (entry): entry is string => typeof entry === "string" && Boolean(entry),
    ),
    timelineBand: normalizeString(rawInput.timelineBand),
    utmCampaign: normalizeString(rawInput.utmCampaign),
    utmContent: normalizeString(rawInput.utmContent),
    utmMedium: normalizeString(rawInput.utmMedium),
    utmSource: normalizeString(rawInput.utmSource),
    utmTerm: normalizeString(rawInput.utmTerm),
    website: normalizeString(rawInput.website),
  });

  if (!parsedInput.success) {
    const fieldErrors = buildFieldErrors(parsedInput.error);

    console.error("Quote request validation failed", {
      ...logContext,
      fieldErrors: Object.keys(fieldErrors),
    });

    return {
      captchaError: null,
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  if (!serverFeatureFlags.serviceRoleEnabled) {
    console.error(
      "Quote request submission skipped because service-role access is disabled",
      logContext,
    );
    await recordWatchdogEvent({
      context: watchdogContext,
      reason: "service_role_disabled",
      source: "quote_request",
      status: "error",
    });

    return {
      captchaError: null,
      status: "error",
      message:
        "The contact form is temporarily unavailable. Email hello@scalzostudio.com instead.",
      fieldErrors: {},
    };
  }

  if (!serverFeatureFlags.hcaptchaEnabled) {
    console.error(
      "Quote request submission skipped because hCaptcha is disabled",
      logContext,
    );
    await recordWatchdogEvent({
      context: watchdogContext,
      reason: "hcaptcha_disabled",
      source: "quote_request",
      status: "error",
    });

    return {
      captchaError: null,
      status: "error",
      message:
        "The contact form is temporarily unavailable. Email hello@scalzostudio.com instead.",
      fieldErrors: {},
    };
  }

  const hCaptchaToken = normalizeString(rawInput.hCaptchaToken).trim();

  if (!hCaptchaToken) {
    return {
      captchaError: "Complete the hCaptcha check before submitting.",
      status: "error",
      message: "Complete the anti-spam check and try again.",
      fieldErrors: {},
    };
  }

  try {
    const verification = await verifyHCaptchaToken(hCaptchaToken);

    if (!verification.success) {
      console.error("Quote request hCaptcha verification failed", {
        ...logContext,
        challengeTimestamp: verification.challengeTimestamp,
        errorCodes: verification.errorCodes,
        hasHostname: verification.hasHostname,
        hasRemoteIp: verification.hasRemoteIp,
        hasUserAgent: verification.hasUserAgent,
      });

      return {
        captchaError: "Complete the hCaptcha check before submitting.",
        status: "error",
        message: "Complete the anti-spam check and try again.",
        fieldErrors: {},
      };
    }
  } catch (error) {
    console.error("Quote request hCaptcha verification errored", {
      ...logContext,
      error: serializeErrorForLog(error),
    });
    await recordWatchdogEvent({
      context: {
        ...watchdogContext,
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
      reason: "hcaptcha_verification_error",
      source: "quote_request",
      status: "error",
    });

    return {
      captchaError: "The anti-spam check could not be verified. Try again.",
      status: "error",
      message:
        "The request could not be verified right now. Please try again or email hello@scalzostudio.com.",
      fieldErrors: {},
    };
  }

  try {
    const input = parsedInput.data;
    const newsletterOptIn =
      normalizeString(rawInput.newsletterOptIn) === "true";
    const supabase = createServiceRoleSupabaseClient();
    const leadInsert: Database["public"]["Tables"]["leads"]["Insert"] = {
      budget_band: input.budgetBand,
      company: input.company,
      email: input.email,
      message: buildLeadMessage(input),
      name: input.name,
      page_path: input.pagePath,
      services_interest: input.servicesInterest,
      source_utm: {
        referrer: input.referrer ?? null,
        submitted_via: "contact-page",
        utm_campaign: input.utmCampaign ?? null,
        utm_content: input.utmContent ?? null,
        utm_medium: input.utmMedium ?? null,
        utm_source: input.utmSource ?? null,
        utm_term: input.utmTerm ?? null,
      },
      timeline_band: input.timelineBand,
      website: input.website,
    };

    const { data, error } = await supabase
      .from("leads")
      .insert(leadInsert)
      .select("created_at, id")
      .single();

    if (error) {
      console.error("Quote request insert failed", {
        ...logContext,
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
      });
      await recordWatchdogEvent({
        context: {
          ...watchdogContext,
          errorCode: error.code ?? null,
        },
        reason: "lead_insert_failed",
        source: "quote_request",
        status: "error",
      });

      return {
        captchaError: null,
        status: "error",
        message:
          "The request could not be saved right now. Please try again or email hello@scalzostudio.com.",
        fieldErrors: {},
      };
    }

    await captureServerEvent(
      input.email,
      "quote_request_submitted",
      {
        budget_band: input.budgetBand,
        lead_id: data.id,
        newsletter_opt_in: newsletterOptIn,
        page_path: input.pagePath,
        project_type: input.projectType,
        services_interest: input.servicesInterest,
        timeline_band: input.timelineBand,
        utm_campaign: input.utmCampaign ?? null,
        utm_medium: input.utmMedium ?? null,
        utm_source: input.utmSource ?? null,
      },
      {
        pagePath: input.pagePath,
        referrer: input.referrer ?? null,
      },
    );

    if (serverFeatureFlags.contactNotificationsEnabled) {
      const emailPayload = buildQuoteRequestEmailPayload(input, {
        createdAt: data.created_at,
        id: data.id,
      });
      const emailLogContext = buildQuoteRequestEmailLogContext(emailPayload);
      const emailResults = await sendQuoteRequestEmails(emailPayload);

      for (const [emailKind, result] of Object.entries(emailResults)) {
        if (result.status === "fulfilled") {
          continue;
        }

        console.error("Quote request email send failed", {
          ...emailLogContext,
          emailKind,
          error: serializeQuoteRequestEmailErrorForLog(result.reason),
        });
      }
    }

    if (newsletterOptIn) {
      const newsletterLogContext = buildNewsletterSignupLogContext({
        email: input.email,
        pagePath: input.pagePath,
        placement: "contact",
      });

      try {
        const newsletterResult = await createOrRefreshPendingNewsletterSignup({
          email: input.email,
          pagePath: input.pagePath,
          placement: "contact",
        });

        if (newsletterResult === "disabled") {
          console.error(
            "Quote request newsletter signup skipped because the integration is disabled",
            newsletterLogContext,
          );
        }
      } catch (error) {
        console.error("Quote request newsletter signup failed", {
          ...newsletterLogContext,
          error: serializeNewsletterErrorForLog(error),
        });
      }
    }

    await recordWatchdogEvent({
      context: {
        ...watchdogContext,
        leadId: data.id,
      },
      reason: "submitted",
      source: "quote_request",
      status: "success",
    });

    return {
      captchaError: null,
      status: "success",
      message: "Thanks. The request is in and will be reviewed shortly.",
      fieldErrors: {},
    };
  } catch (error) {
    console.error("Quote request submission threw an unexpected error", {
      ...logContext,
      error: serializeErrorForLog(error),
    });
    await recordWatchdogEvent({
      context: {
        ...watchdogContext,
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
      reason: "unexpected_error",
      source: "quote_request",
      status: "error",
    });

    return {
      captchaError: null,
      status: "error",
      message:
        "The request could not be saved right now. Please try again or email hello@scalzostudio.com.",
      fieldErrors: {},
    };
  }
}
