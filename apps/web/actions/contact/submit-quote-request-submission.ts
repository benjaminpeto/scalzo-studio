"use server";

import { createOrRefreshPendingNewsletterSignup } from "@/actions/newsletter/create-or-refresh-pending-newsletter-signup";
import {
  buildNewsletterSignupLogContext,
  serializeNewsletterErrorForLog,
} from "@/actions/newsletter/helpers";
import { captureServerEvent } from "@/lib/analytics/server";
import { serverFeatureFlags } from "@/lib/env/server";
import type { Database } from "@/lib/supabase/database.types";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { recordWatchdogEvent } from "@/lib/watchdog/server";
import type { SubmitQuoteRequestState } from "@/interfaces/contact/form";
import type {
  QuoteRequestLogContext,
  QuoteRequestWatchdogContext,
} from "@/interfaces/contact/quote-request";
import { getContactPublicContent } from "@/constants/contact/public-content";

import { buildLeadMessage, serializeErrorForLog } from "./helpers";
import { sendQuoteRequestEmails } from "./quote-request-emails";
import type { ContactLeadInput } from "./schemas";
import {
  createQuoteRequestErrorState,
  createQuoteRequestSuccessState,
} from "./submit-quote-request-input";
import {
  buildQuoteRequestEmailLogContext,
  buildQuoteRequestEmailPayload,
  serializeQuoteRequestEmailErrorForLog,
} from "./quote-request-emails.helpers";

export async function submitValidatedQuoteRequest(input: {
  input: ContactLeadInput;
  locale: string;
  logContext: QuoteRequestLogContext;
  newsletterOptIn: boolean;
  watchdogContext: QuoteRequestWatchdogContext;
}): Promise<SubmitQuoteRequestState> {
  const errorMessages = getContactPublicContent(input.locale).errors;

  try {
    const supabase = createServiceRoleSupabaseClient();
    const leadInsert: Database["public"]["Tables"]["leads"]["Insert"] = {
      budget_band: input.input.budgetBand,
      company: input.input.company,
      email: input.input.email,
      message: buildLeadMessage(input.input),
      name: input.input.name,
      page_path: input.input.pagePath,
      services_interest: input.input.servicesInterest,
      source_utm: {
        referrer: input.input.referrer ?? null,
        submitted_via: "contact-page",
        utm_campaign: input.input.utmCampaign ?? null,
        utm_content: input.input.utmContent ?? null,
        utm_medium: input.input.utmMedium ?? null,
        utm_source: input.input.utmSource ?? null,
        utm_term: input.input.utmTerm ?? null,
      },
      timeline_band: input.input.timelineBand,
      website: input.input.website,
    };
    const { data, error } = await supabase
      .from("leads")
      .insert(leadInsert)
      .select("created_at, id")
      .single();

    if (error) {
      console.error("Quote request insert failed", {
        ...input.logContext,
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
      });
      await recordWatchdogEvent({
        context: { ...input.watchdogContext, errorCode: error.code ?? null },
        reason: "lead_insert_failed",
        source: "quote_request",
        status: "error",
      });

      return createQuoteRequestErrorState({
        message: errorMessages.requestFailed,
      });
    }

    await captureServerEvent(
      input.input.email,
      "quote_request_submitted",
      {
        budget_band: input.input.budgetBand,
        lead_id: data.id,
        newsletter_opt_in: input.newsletterOptIn,
        page_path: input.input.pagePath,
        project_type: input.input.projectType,
        services_interest: input.input.servicesInterest,
        timeline_band: input.input.timelineBand,
        utm_campaign: input.input.utmCampaign ?? null,
        utm_medium: input.input.utmMedium ?? null,
        utm_source: input.input.utmSource ?? null,
      },
      {
        locale: input.locale,
        pagePath: input.input.pagePath,
        referrer: input.input.referrer ?? null,
      },
    );

    if (serverFeatureFlags.contactNotificationsEnabled) {
      const emailPayload = buildQuoteRequestEmailPayload(input.input, {
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

    if (input.newsletterOptIn) {
      const newsletterLogContext = buildNewsletterSignupLogContext({
        email: input.input.email,
        pagePath: input.input.pagePath,
        placement: "contact",
      });

      try {
        const newsletterResult = await createOrRefreshPendingNewsletterSignup({
          email: input.input.email,
          pagePath: input.input.pagePath,
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
      context: { ...input.watchdogContext, leadId: data.id },
      reason: "submitted",
      source: "quote_request",
      status: "success",
    });

    return createQuoteRequestSuccessState(input.locale);
  } catch (error) {
    console.error("Quote request submission threw an unexpected error", {
      ...input.logContext,
      error: serializeErrorForLog(error),
    });
    await recordWatchdogEvent({
      context: {
        ...input.watchdogContext,
        errorName: error instanceof Error ? error.name : "UnknownError",
      },
      reason: "unexpected_error",
      source: "quote_request",
      status: "error",
    });

    return createQuoteRequestErrorState({
      message: errorMessages.requestFailed,
    });
  }
}
