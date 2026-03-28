"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";

import { submitNewsletterSignup } from "@/actions/newsletter/submit-newsletter-signup";
import { initialSubmitNewsletterSignupState } from "@/constants/newsletter/content";

export function useNewsletterSignupForm() {
  const [serverState, formAction, isPending] = useActionState(
    submitNewsletterSignup,
    initialSubmitNewsletterSignupState,
  );
  const pathname = usePathname() || "/";

  return {
    formAction,
    isPending,
    pagePath: pathname,
    serverState,
  };
}
