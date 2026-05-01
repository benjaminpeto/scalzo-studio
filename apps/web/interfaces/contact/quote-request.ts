export interface QuoteRequestFormSnapshot {
  budgetBand: string;
  company: string;
  consent: string;
  email: string;
  hCaptchaToken: string;
  location: string;
  message: string;
  name: string;
  newsletterOptIn: boolean;
  pagePath: string;
  primaryGoal: string;
  projectType: string;
  referrer: string;
  servicesInterest: string[];
  timelineBand: string;
  utmCampaign: string;
  utmContent: string;
  utmMedium: string;
  utmSource: string;
  utmTerm: string;
  website: string;
}

export interface QuoteRequestLogContext {
  budgetBand: string | null;
  hasReferrer: boolean;
  hasUtm: boolean;
  hasWebsite: boolean;
  newsletterOptIn: boolean;
  pagePath: string;
  projectType: string | null;
  servicesInterest: string[];
  timelineBand: string | null;
}

export type QuoteRequestWatchdogContext = Record<string, unknown> & {
  emailDomain: string | null;
  hcaptchaEnabled: boolean;
  pagePath: string;
  serviceRoleEnabled: boolean;
};

export interface QuoteRequestSavedLead {
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
