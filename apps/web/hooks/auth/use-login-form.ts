"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  requestAdminMagicLink,
  signInAdminWithPassword,
} from "@/actions/auth/client";
import { normalizeAuthRedirectPath } from "@/lib/supabase/auth-flow";
import posthog from "posthog-js";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter both your email and password.");
      setSuccessMessage(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await signInAdminWithPassword({
        email,
        password,
      });
      posthog.identify(email, { email });
      posthog.capture("admin_login_succeeded", { method: "password" });
      router.replace(next);
    } catch (nextError: unknown) {
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

    setIsMagicLinkLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await requestAdminMagicLink({
        email,
        next,
        origin: window.location.origin,
      });

      setSuccessMessage(
        "Magic link sent. Use the email link to continue with admin sign-in.",
      );
    } catch (nextError: unknown) {
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
    email,
    error,
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
