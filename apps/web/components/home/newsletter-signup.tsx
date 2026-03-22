"use client";

import { useId, useState } from "react";

import { Reveal } from "@/components/home/motion";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

export function NewsletterSignup() {
  const [submitted, setSubmitted] = useState(false);
  const emailId = useId();

  return (
    <Section id="newsletter">
      <Reveal>
        <Grid gap="2xl" className="lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Stack gap="lg">
            <p className="section-kicker">Newsletter</p>
            <h2 className="font-display text-balance mt-5 text-4xl leading-none tracking-[-0.04em] text-foreground sm:text-5xl">
              Quiet notes on product, brand, and content for studios and growing
              teams.
            </h2>
            <Prose measure="md" className="mt-1">
              This is a frontend-only shell for now, but it includes a
              success-ready interaction so the final implementation can connect
              to a real signup flow later without reworking the layout.
            </Prose>
          </Stack>

          <div className="surface-grain rounded-4xl border border-border/70 bg-[rgba(255,255,255,0.65)] p-6 shadow-[0_18px_52px_rgba(79,60,42,0.08)] sm:p-8">
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="space-y-3">
                <label
                  htmlFor={emailId}
                  className="section-kicker block text-foreground"
                >
                  Email address
                </label>
                <Input
                  id={emailId}
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="h-14 rounded-full border-border bg-white/80 px-5 text-base shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  className="h-13 rounded-full bg-primary px-7 text-[0.78rem] uppercase tracking-[0.22em] text-primary-foreground hover:bg-primary/90"
                >
                  Join the newsletter
                </Button>
                <p className="text-sm leading-6 text-muted-foreground">
                  Short, occasional notes only. No automation-heavy cadence.
                </p>
              </div>
              <p
                aria-live="polite"
                className="min-h-6 text-sm leading-6 text-foreground"
              >
                {submitted
                  ? "Placeholder success state: thanks, you are on the list."
                  : "Success and backend wiring can be connected later without changing this form shell."}
              </p>
            </form>
          </div>
        </Grid>
      </Reveal>
    </Section>
  );
}
