"use client";

import { useActionState } from "react";

import { submitNewsletterSignup } from "@/actions/newsletter/submit-newsletter-signup";
import { initialSubmitNewsletterSignupState } from "@/constants/newsletter/content";

export function useNewsletterSignupForm() {
  const [serverState, formAction, isPending] = useActionState(
    submitNewsletterSignup,
    initialSubmitNewsletterSignupState,
  );

  return {
    formAction,
    isPending,
    serverState,
  };
}
