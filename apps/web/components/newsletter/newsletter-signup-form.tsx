import { useNewsletterSignupForm } from "@/hooks/newsletter/use-newsletter-signup-form";
import { NewsletterPlacement } from "@/interfaces/newsletter/form";
import { captureEvent } from "@/lib/analytics/client";
import { Suspense, useEffect, useId, useRef } from "react";
import { NewsletterSignupStatus } from "./newsletter-signup-status";
import { newsletterSignupContent } from "@/constants/newsletter/content";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import { usePathname } from "next/navigation";

export function NewsletterSignupForm({
  placement,
  variant,
}: {
  placement: NewsletterPlacement;
  variant: "compact" | "editorial" | "inline";
}) {
  const emailId = useId();
  const { formAction, isPending, serverState } = useNewsletterSignupForm();
  const capturedRef = useRef(false);
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (serverState.status === "success" && !capturedRef.current) {
      capturedRef.current = true;
      captureEvent("newsletter_subscribe", {
        page_path: window.location.pathname,
        placement,
      });
    }
  }, [serverState.status, placement]);

  if (serverState.status === "success") {
    return (
      <NewsletterSignupStatus
        message={serverState.message}
        status={serverState.status}
        variant={variant}
      />
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="placement" value={placement} />
      <Suspense fallback={<input type="hidden" name="pagePath" value="/" />}>
        <input type="hidden" name="pagePath" value={pathname} />
      </Suspense>

      <div className={variant === "compact" ? "space-y-2" : "space-y-3"}>
        <label
          htmlFor={emailId}
          className={
            variant === "compact"
              ? "sr-only"
              : "section-kicker block text-foreground"
          }
        >
          {newsletterSignupContent.shared.inputLabel}
        </label>
        <Input
          id={emailId}
          name="email"
          type="email"
          required
          placeholder={newsletterSignupContent.shared.inputPlaceholder}
          className={
            variant === "compact"
              ? "h-12 rounded-full border-border bg-white/80 px-4 text-sm text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              : "h-14 rounded-full border-border bg-white/80 px-5 text-base shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          }
        />
        {serverState.fieldErrors.email ? (
          <p className="text-sm leading-6 text-foreground">
            {serverState.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div
        className={
          variant === "compact"
            ? "space-y-3"
            : "flex flex-col gap-3 sm:flex-row sm:items-center"
        }
      >
        <Button
          type="submit"
          disabled={isPending}
          className={
            variant === "compact"
              ? "h-12 rounded-full bg-primary px-6 text-[0.72rem] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
              : "h-13 rounded-full bg-primary px-7 text-[0.78rem] uppercase tracking-[0.22em] text-primary-foreground hover:bg-primary/90"
          }
        >
          {isPending
            ? "Sending..."
            : newsletterSignupContent.shared.buttonLabel}
        </Button>
        <p
          className={
            variant === "compact"
              ? "text-sm leading-6 text-muted-foreground"
              : "text-sm leading-6 text-muted-foreground"
          }
        >
          {newsletterSignupContent.shared.legalNote}
        </p>
      </div>

      <NewsletterSignupStatus
        message={serverState.message}
        status={serverState.status}
        variant={variant}
      />
    </form>
  );
}
