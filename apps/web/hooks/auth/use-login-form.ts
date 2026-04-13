"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  requestAdminMagicLink,
  signInAdminWithPassword,
} from "@/actions/auth/client";
import { normalizeAuthRedirectPath } from "@/lib/supabase/auth-flow";
import { captureEvent } from "@/lib/analytics/client";
import { publicFeatureFlags } from "@/lib/env/public";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaRenderKey, setCaptchaRenderKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = normalizeAuthRedirectPath(searchParams.get("next"));
  const authError = searchParams.get("error");
  const authMessage = searchParams.get("message");
  const isBusy = isLoading || isMagicLinkLoading;
  const requiresCaptcha = publicFeatureFlags.hcaptchaEnabled;

  function resetCaptcha() {
    setCaptchaToken("");
    setCaptchaRenderKey((currentValue) => currentValue + 1);
  }

  function validateCaptcha() {
    if (!requiresCaptcha) {
      return true;
    }

    if (captchaToken.trim()) {
      return true;
    }

    setCaptchaError("Complete the hCaptcha check before continuing.");
    setSuccessMessage(null);
    return false;
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter both your email and password.");
      setSuccessMessage(null);
      return;
    }

    if (!validateCaptcha()) {
      return;
    }

    setIsLoading(true);
    setCaptchaError(null);
    setError(null);
    setSuccessMessage(null);

    try {
      await signInAdminWithPassword({
        captchaToken: requiresCaptcha ? captchaToken : undefined,
        email,
        password,
      });
      captureEvent("admin_login_succeeded", { method: "password" });
      router.replace(next);
    } catch (nextError: unknown) {
      resetCaptcha();
      setError(
        nextError instanceof Error ? nextError.message : "An error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMagicLinkLogin() {
    if (!email.trim()) {
      setError("Enter your email to request a magic link.");
      setSuccessMessage(null);
      return;
    }

    if (!validateCaptcha()) {
      return;
    }

    setIsMagicLinkLoading(true);
    setCaptchaError(null);
    setError(null);
    setSuccessMessage(null);

    try {
      await requestAdminMagicLink({
        captchaToken: requiresCaptcha ? captchaToken : undefined,
        email,
        next,
        origin: window.location.origin,
      });

      resetCaptcha();
      setSuccessMessage(
        "Magic link sent. Use the email link to continue with admin sign-in.",
      );
    } catch (nextError: unknown) {
      resetCaptcha();
      setError(
        nextError instanceof Error ? nextError.message : "An error occurred",
      );
    } finally {
      setIsMagicLinkLoading(false);
    }
  }

  return {
    authError,
    authMessage,
    captchaError,
    captchaRenderKey,
    email,
    error,
    handleCaptchaError: (message: string) => {
      setCaptchaToken("");
      setCaptchaError(message);
    },
    handleCaptchaExpire: () => {
      setCaptchaToken("");
      setCaptchaError("Complete the hCaptcha check before continuing.");
    },
    handleCaptchaVerify: (token: string) => {
      setCaptchaToken(token);
      setCaptchaError(null);
    },
    handleLogin,
    handleMagicLinkLogin,
    isBusy,
    isLoading,
    isMagicLinkLoading,
    next,
    password,
    setEmail,
    setPassword,
    successMessage,
  };
}
