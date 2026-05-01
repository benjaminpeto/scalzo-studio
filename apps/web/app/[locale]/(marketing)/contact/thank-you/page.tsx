import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { BookingPanel } from "@/components/contact/booking-panel";
import { QuoteRequestSuccessState } from "@/components/contact/quote-request-form/chrome";
import { getContactPublicContent } from "@/constants/contact/public-content";
import { Reveal } from "@/components/home/motion";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { MarketingPageProps } from "@/interfaces/home/content";

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "contactThankYou");
}

export default async function ContactThankYouPage({
  params,
}: MarketingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContactPublicContent(locale).thankYouPage;

  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Stack gap="lg">
            <p className="section-kicker">{content.kicker}</p>
            <h1 className="max-w-5xl font-display text-[3.1rem] leading-[0.92] tracking-[-0.06em] text-foreground sm:text-[4.1rem] lg:text-[5rem]">
              {content.title}
            </h1>
            <Prose size="lg" measure="lg">
              {content.body}
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
            <BookingPanel locale={locale} />
          </Grid>
        </Reveal>
      </Section>
    </>
  );
}
