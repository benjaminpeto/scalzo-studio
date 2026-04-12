"use client";

import { usePathname } from "next/navigation";
import { Suspense, useId } from "react";

import { Reveal } from "@/components/home/motion";
import { newsletterSignupContent } from "@/constants/newsletter/content";
import { useNewsletterSignupForm } from "@/hooks/newsletter/use-newsletter-signup-form";
import type { NewsletterPlacement } from "@/interfaces/newsletter/form";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

interface NewsletterSignupProps {
  placement: NewsletterPlacement;
}

function NewsletterSignupStatus({
  message,
  status,
  variant,
}: {
  message: string | null;
  status: "idle" | "error" | "success";
  variant: "compact" | "editorial" | "inline";
}) {
  if (!message && status === "idle") {
    return null;
  }

  const className =
    status === "error"
      ? "border border-destructive/20 bg-destructive/6 text-foreground"
      : variant === "compact"
        ? "border border-emerald-200/70 bg-emerald-50/70 text-foreground"
        : "border border-emerald-200/70 bg-emerald-50/70 text-foreground";

  return (
    <p
      aria-live="polite"
      className={`min-h-6 rounded-[1rem] px-4 py-3 text-sm leading-6 ${className}`}
    >
      {message}
    </p>
  );
}

function NewsletterSignupForm({
  placement,
  variant,
}: {
  placement: NewsletterPlacement;
  variant: "compact" | "editorial" | "inline";
}) {
  const emailId = useId();
  const { formAction, isPending, serverState } = useNewsletterSignupForm();

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
      <Suspense fallback={<NewsletterSignupPagePathInputFallback />}>
        <NewsletterSignupPagePathInput />
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

function NewsletterSignupPagePathInput() {
  const pathname = usePathname() || "/";

  return <input type="hidden" name="pagePath" value={pathname} />;
}

function NewsletterSignupPagePathInputFallback() {
  return <input type="hidden" name="pagePath" value="/" />;
}

export function NewsletterSignup({ placement }: NewsletterSignupProps) {
  const content = newsletterSignupContent.placements[placement];

  if (placement === "footer") {
    return (
      <div className="surface-grain rounded-[1.6rem] border border-border/70 bg-white/80 p-5 shadow-[0_16px_44px_rgba(27,28,26,0.05)]">
        <p className="section-kicker">{content.kicker}</p>
        <h3 className="mt-4 font-display text-[2rem] leading-[0.94] tracking-[-0.04em] text-foreground">
          {content.title}
        </h3>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {content.intro}
        </p>
        <div className="mt-5">
          <NewsletterSignupForm placement={placement} variant="compact" />
        </div>
      </div>
    );
  }

  if (placement === "insights-detail") {
    return (
      <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/88 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
        <p className="section-kicker">{content.kicker}</p>
        <h2 className="mt-5 max-w-2xl font-display text-[2.4rem] leading-[0.95] tracking-[-0.05em] text-foreground sm:text-[3rem]">
          {content.title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {content.intro}
        </p>
        <div className="mt-6">
          <NewsletterSignupForm placement={placement} variant="inline" />
        </div>
      </div>
    );
  }

  return (
    <Section id="newsletter">
      <Reveal>
        <Grid gap="2xl" className="lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Stack gap="lg">
            <p className="section-kicker">{content.kicker}</p>
            <h2 className="mt-5 text-balance font-display text-4xl leading-none tracking-[-0.04em] text-foreground sm:text-5xl">
              {content.title}
            </h2>
            <Prose measure="md" className="mt-1">
              {content.intro}
            </Prose>
          </Stack>

          <div className="surface-grain rounded-4xl border border-border/70 bg-[rgba(255,255,255,0.65)] p-6 shadow-[0_18px_52px_rgba(79,60,42,0.08)] sm:p-8">
            <NewsletterSignupForm placement={placement} variant="editorial" />
          </div>
        </Grid>
      </Reveal>
    </Section>
  );
}
