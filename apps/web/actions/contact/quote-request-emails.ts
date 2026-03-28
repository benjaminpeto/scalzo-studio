import "server-only";

import type { CreateEmailOptions } from "resend";

import {
  contactBudgetOptions,
  contactLocationOptions,
  contactPageContent,
  contactProjectTypeOptions,
  contactServiceOptions,
  contactTimelineOptions,
} from "@/constants/contact/content";
import { getBookingAction } from "@/lib/booking/config";
import { sendResendEmail } from "@/lib/resend/client";

import type { ContactLeadInput } from "./schemas";

const serviceLabelByValue: Map<string, string> = new Map(
  contactServiceOptions.map((option) => [option.value, option.label]),
);
const projectTypeLabelByValue: Map<string, string> = new Map(
  contactProjectTypeOptions.map((option) => [option.value, option.label]),
);
const locationLabelByValue: Map<string, string> = new Map(
  contactLocationOptions.map((option) => [option.value, option.label]),
);
const budgetLabelByValue: Map<string, string> = new Map(
  contactBudgetOptions.map((option) => [option.value, option.label]),
);
const timelineLabelByValue: Map<string, string> = new Map(
  contactTimelineOptions.map((option) => [option.value, option.label]),
);

interface SavedLeadEmailMetadata {
  createdAt: string;
  id: string;
}

export interface QuoteRequestEmailPayload {
  bookingFallbackHref: string;
  bookingFallbackLabel: string;
  bookingResponseNote: string;
  budgetBandLabel: string;
  company: string | null;
  email: string;
  leadId: string;
  locationLabel: string | null;
  message: string;
  name: string;
  pagePath: string;
  primaryGoal: string;
  projectTypeLabel: string | null;
  referrer: string | null;
  servicesInterestLabels: string[];
  submittedAt: string;
  timelineBandLabel: string;
  utmCampaign: string | null;
  utmContent: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  utmTerm: string | null;
  website: string | null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatOptionalLine(label: string, value: string | null) {
  return value ? `${label}: ${value}` : null;
}

function renderHtmlField(label: string, value: string) {
  return `<tr><td style="padding:8px 12px 8px 0;font-weight:600;vertical-align:top;">${escapeHtml(
    label,
  )}</td><td style="padding:8px 0;vertical-align:top;">${escapeHtml(
    value,
  )}</td></tr>`;
}

function renderHtmlMultiline(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function resolveLabel(
  labelByValue: Map<string, string>,
  value: string | null | undefined,
) {
  if (!value) {
    return null;
  }

  return labelByValue.get(value) ?? value;
}

function resolveServiceLabels(values: string[]) {
  return values.map((value) => serviceLabelByValue.get(value) ?? value);
}

export function buildQuoteRequestEmailPayload(
  input: ContactLeadInput,
  lead: SavedLeadEmailMetadata,
): QuoteRequestEmailPayload {
  const bookingAction = getBookingAction();

  return {
    bookingFallbackHref: bookingAction.href,
    bookingFallbackLabel: bookingAction.label,
    bookingResponseNote: contactPageContent.form.responseNote,
    budgetBandLabel:
      resolveLabel(budgetLabelByValue, input.budgetBand) ?? input.budgetBand,
    company: input.company ?? null,
    email: input.email,
    leadId: lead.id,
    locationLabel: resolveLabel(locationLabelByValue, input.location),
    message: input.message,
    name: input.name,
    pagePath: input.pagePath,
    primaryGoal: input.primaryGoal,
    projectTypeLabel: resolveLabel(projectTypeLabelByValue, input.projectType),
    referrer: input.referrer ?? null,
    servicesInterestLabels: resolveServiceLabels(input.servicesInterest),
    submittedAt: lead.createdAt,
    timelineBandLabel:
      resolveLabel(timelineLabelByValue, input.timelineBand) ??
      input.timelineBand,
    utmCampaign: input.utmCampaign ?? null,
    utmContent: input.utmContent ?? null,
    utmMedium: input.utmMedium ?? null,
    utmSource: input.utmSource ?? null,
    utmTerm: input.utmTerm ?? null,
    website: input.website ?? null,
  };
}

export function buildQuoteRequestEmailLogContext(
  payload: QuoteRequestEmailPayload,
) {
  return {
    budgetBand: payload.budgetBandLabel,
    hasReferrer: Boolean(payload.referrer),
    hasUtm: Boolean(
      payload.utmCampaign ||
      payload.utmContent ||
      payload.utmMedium ||
      payload.utmSource ||
      payload.utmTerm,
    ),
    leadId: payload.leadId,
    pagePath: payload.pagePath,
    servicesInterest: payload.servicesInterestLabels,
    timelineBand: payload.timelineBandLabel,
  };
}

export function serializeQuoteRequestEmailErrorForLog(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return {
      code:
        "code" in error && typeof error.code === "string" ? error.code : null,
      message: error.message,
      name:
        "name" in error && typeof error.name === "string" ? error.name : null,
      statusCode:
        "statusCode" in error && typeof error.statusCode === "number"
          ? error.statusCode
          : null,
    };
  }

  return {
    code: null,
    message: String(error),
    name: null,
    statusCode: null,
  };
}

export function buildInternalQuoteRequestEmail(
  payload: QuoteRequestEmailPayload,
  envelope: { fromEmail: string; toEmail: string },
): CreateEmailOptions {
  const optionalContextLines = [
    formatOptionalLine("Company", payload.company),
    formatOptionalLine("Website / profile", payload.website),
    formatOptionalLine("Project type", payload.projectTypeLabel),
    formatOptionalLine("Location", payload.locationLabel),
    formatOptionalLine("Referrer", payload.referrer),
    formatOptionalLine("UTM source", payload.utmSource),
    formatOptionalLine("UTM medium", payload.utmMedium),
    formatOptionalLine("UTM campaign", payload.utmCampaign),
    formatOptionalLine("UTM content", payload.utmContent),
    formatOptionalLine("UTM term", payload.utmTerm),
  ].filter((line): line is string => Boolean(line));

  const htmlRows = [
    renderHtmlField("Lead ID", payload.leadId),
    renderHtmlField("Submitted at", payload.submittedAt),
    renderHtmlField("Name", payload.name),
    renderHtmlField("Email", payload.email),
    payload.company ? renderHtmlField("Company", payload.company) : null,
    payload.website
      ? renderHtmlField("Website / profile", payload.website)
      : null,
    renderHtmlField("Services", payload.servicesInterestLabels.join(", ")),
    renderHtmlField("Primary goal", payload.primaryGoal),
    payload.projectTypeLabel
      ? renderHtmlField("Project type", payload.projectTypeLabel)
      : null,
    payload.locationLabel
      ? renderHtmlField("Location", payload.locationLabel)
      : null,
    renderHtmlField("Budget", payload.budgetBandLabel),
    renderHtmlField("Timeline", payload.timelineBandLabel),
    renderHtmlField("Page path", payload.pagePath),
    payload.referrer ? renderHtmlField("Referrer", payload.referrer) : null,
    payload.utmSource ? renderHtmlField("UTM source", payload.utmSource) : null,
    payload.utmMedium ? renderHtmlField("UTM medium", payload.utmMedium) : null,
    payload.utmCampaign
      ? renderHtmlField("UTM campaign", payload.utmCampaign)
      : null,
    payload.utmContent
      ? renderHtmlField("UTM content", payload.utmContent)
      : null,
    payload.utmTerm ? renderHtmlField("UTM term", payload.utmTerm) : null,
  ]
    .filter((row): row is string => Boolean(row))
    .join("");

  const text = [
    "A new quote request has been submitted.",
    "",
    `Lead ID: ${payload.leadId}`,
    `Submitted at: ${payload.submittedAt}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Services: ${payload.servicesInterestLabels.join(", ")}`,
    `Primary goal: ${payload.primaryGoal}`,
    `Budget: ${payload.budgetBandLabel}`,
    `Timeline: ${payload.timelineBandLabel}`,
    `Page path: ${payload.pagePath}`,
    ...optionalContextLines,
    "",
    "Brief:",
    payload.message,
  ].join("\n");

  return {
    from: envelope.fromEmail,
    html: [
      '<div style="font-family:Arial,sans-serif;color:#111311;line-height:1.6;">',
      '<p style="margin:0 0 16px;">A new quote request has been submitted.</p>',
      `<table style="border-collapse:collapse;">${htmlRows}</table>`,
      '<h2 style="margin:24px 0 12px;font-size:18px;">Brief</h2>',
      `<p style="margin:0;">${renderHtmlMultiline(payload.message)}</p>`,
      "</div>",
    ].join(""),
    replyTo: payload.email,
    subject: payload.company
      ? `New quote request from ${payload.name} at ${payload.company}`
      : `New quote request from ${payload.name}`,
    text,
    to: envelope.toEmail,
  };
}

export function buildQuoteRequestConfirmationEmail(
  payload: QuoteRequestEmailPayload,
  envelope: { fromEmail: string; toEmail: string },
): CreateEmailOptions {
  const summaryLines = [
    `Services: ${payload.servicesInterestLabels.join(", ")}`,
    `Primary goal: ${payload.primaryGoal}`,
    formatOptionalLine("Project type", payload.projectTypeLabel),
    formatOptionalLine("Location", payload.locationLabel),
    `Budget: ${payload.budgetBandLabel}`,
    `Timeline: ${payload.timelineBandLabel}`,
    formatOptionalLine("Website / profile", payload.website),
  ].filter((line): line is string => Boolean(line));

  const htmlSummary = summaryLines
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join("");

  const text = [
    `Hi ${payload.name},`,
    "",
    "Thanks for sending through your quote request.",
    payload.bookingResponseNote,
    "",
    "Summary",
    ...summaryLines,
    "",
    `If a quick call would move faster, use ${payload.bookingFallbackLabel}: ${payload.bookingFallbackHref}`,
  ].join("\n");

  return {
    from: envelope.fromEmail,
    html: [
      '<div style="font-family:Arial,sans-serif;color:#111311;line-height:1.6;">',
      `<p style="margin:0 0 16px;">Hi ${escapeHtml(payload.name)},</p>`,
      '<p style="margin:0 0 16px;">Thanks for sending through your quote request.</p>',
      `<p style="margin:0 0 16px;">${escapeHtml(payload.bookingResponseNote)}</p>`,
      '<h2 style="margin:24px 0 12px;font-size:18px;">Summary</h2>',
      `<ul style="margin:0 0 20px;padding-left:20px;">${htmlSummary}</ul>`,
      `<p style="margin:0;">If a quick call would move faster, use <a href="${escapeHtml(
        payload.bookingFallbackHref,
      )}">${escapeHtml(payload.bookingFallbackLabel)}</a>.</p>`,
      "</div>",
    ].join(""),
    subject: "We received your quote request",
    text,
    to: envelope.toEmail,
  };
}

export async function sendQuoteRequestEmails(
  payload: QuoteRequestEmailPayload,
) {
  const { serverEnv } = await import("@/lib/env/server");
  const envelope = {
    fromEmail: serverEnv.contactFromEmail!,
    toEmail: serverEnv.contactToEmail!,
  };

  const [confirmation, internal] = await Promise.allSettled([
    sendResendEmail(
      buildQuoteRequestConfirmationEmail(payload, {
        fromEmail: envelope.fromEmail,
        toEmail: payload.email,
      }),
    ),
    sendResendEmail(buildInternalQuoteRequestEmail(payload, envelope)),
  ]);

  return {
    confirmation,
    internal,
  };
}
