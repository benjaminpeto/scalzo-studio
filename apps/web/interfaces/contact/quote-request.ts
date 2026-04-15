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
