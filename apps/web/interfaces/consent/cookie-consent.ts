export type CookieConsentDecision = "accepted" | "declined";

export interface CookieConsentState {
  decision: CookieConsentDecision;
  decidedAt: string; // ISO 8601
}

export const COOKIE_CONSENT_STORAGE_KEY = "scalzo-cookie-consent" as const;
