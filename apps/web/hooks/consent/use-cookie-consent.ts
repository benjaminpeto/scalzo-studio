"use client";

import posthog from "posthog-js";
import { useCallback, useEffect, useState } from "react";

import type {
  CookieConsentDecision,
  CookieConsentState,
} from "@/interfaces/consent/cookie-consent";
import { COOKIE_CONSENT_STORAGE_KEY } from "@/interfaces/consent/cookie-consent";

function readStoredConsent(): CookieConsentState | null {
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "decision" in parsed &&
      (parsed.decision === "accepted" || parsed.decision === "declined") &&
      "decidedAt" in parsed &&
      typeof parsed.decidedAt === "string"
    ) {
      return parsed as CookieConsentState;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStoredConsent(state: CookieConsentState): void {
  try {
    window.localStorage.setItem(
      COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(state),
    );
  } catch {}
}

function syncPostHogWithDecision(decision: CookieConsentDecision): void {
  if (decision === "accepted") {
    posthog.opt_in_capturing({ captureEventName: null });
  } else {
    posthog.opt_out_capturing();
  }
}

export function useCookieConsent(): {
  bannerVisible: boolean;
  handleAccept: () => void;
  handleDecline: () => void;
} {
  const [storedState, setStoredState] = useState<CookieConsentState | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    setStoredState(stored);
    setIsHydrated(true);

    if (stored !== null) {
      syncPostHogWithDecision(stored.decision);
    }
  }, []);

  const handleAccept = useCallback(() => {
    const newState: CookieConsentState = {
      decision: "accepted",
      decidedAt: new Date().toISOString(),
    };
    posthog.opt_in_capturing({ captureEventName: null });
    writeStoredConsent(newState);
    setStoredState(newState);
  }, []);

  const handleDecline = useCallback(() => {
    const newState: CookieConsentState = {
      decision: "declined",
      decidedAt: new Date().toISOString(),
    };
    posthog.opt_out_capturing();
    writeStoredConsent(newState);
    setStoredState(newState);
  }, []);

  return {
    bannerVisible: isHydrated && storedState === null,
    handleAccept,
    handleDecline,
  };
}
