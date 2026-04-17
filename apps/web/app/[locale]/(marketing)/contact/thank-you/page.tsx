import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { BookingPanel } from "@/components/contact/booking-panel";
import { QuoteRequestSuccessState } from "@/components/contact/quote-request-form/chrome";
import { Reveal } from "@/components/home/motion";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

interface ContactThankYouPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactThankYouPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "contactThankYou");
}

export default async function ContactThankYouPage({
  params,
}: ContactThankYouPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Stack gap="lg">
            <p className="section-kicker">Contact</p>
            <h1 className="max-w-5xl font-display text-[3.1rem] leading-[0.92] tracking-[-0.06em] text-foreground sm:text-[4.1rem] lg:text-[5rem]">
              Thanks. Your request is with us.
            </h1>
            <Prose size="lg" measure="lg">
              The quote request has been saved and queued for manual review. Use
              the booking option if the project would move faster through a
              short conversation while the first response is being prepared.
            </Prose>
          </Stack>
        </Reveal>
      </Section>

      <Section spacing="tight">
        <Reveal>
          <Grid
            gap="xl"
            className="lg:grid-cols-[0.58fr_0.42fr] lg:items-start"
          >
            <QuoteRequestSuccessState />
            <BookingPanel />
          </Grid>
        </Reveal>
      </Section>
    </>
  );
}
