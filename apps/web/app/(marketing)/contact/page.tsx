import type { Metadata } from "next";

import { Reveal, ScrollFloat } from "@/components/home/motion";
import { BookingPanel } from "@/components/contact/booking-panel";
import { QuoteRequestForm } from "@/components/contact/quote-request-form";
import { contactPageContent } from "@/lib/content/contact";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { Button } from "@ui/components/ui/button";

export const metadata: Metadata = {
  alternates: {
    canonical: "/contact",
  },
  description:
    "Contact Scalzo Studio to request a quote or book a discovery call for positioning, design systems, and digital rollout work.",
  title: "Contact | Scalzo Studio",
};

export default function ContactPage() {
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">{contactPageContent.hero.kicker}</p>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.5rem] lg:text-[5.9rem]">
                  {contactPageContent.hero.title}
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                {contactPageContent.hero.intro}
              </Prose>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-12 rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
                >
                  <a href="#contact-form">Request a quote</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-border bg-white px-6 text-[0.78rem] uppercase tracking-[0.2em] text-foreground hover:bg-white"
                >
                  <a href="#booking">Book a call</a>
                </Button>
              </div>
            </Stack>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <p className="section-kicker">What this page handles</p>
              <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground">
                {contactPageContent.hero.signals.map((signal) => (
                  <p key={signal}>{signal}</p>
                ))}
              </div>
            </div>
          </Grid>
        </Reveal>
      </Section>

      <Section id="contact-form" spacing="tight">
        <Reveal>
          <Grid
            gap="xl"
            className="lg:grid-cols-[0.58fr_0.42fr] lg:items-start"
          >
            <QuoteRequestForm />
            <BookingPanel />
          </Grid>
        </Reveal>
      </Section>
    </>
  );
}
