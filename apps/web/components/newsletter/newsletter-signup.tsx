"use client";

import { Reveal } from "@/components/home/motion";
import { newsletterSignupContent } from "@/constants/newsletter/content";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { NewsletterSignupForm } from "./newsletter-signup-form";
import { NewsletterSignupProps } from "@/interfaces/newsletter/form";

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
