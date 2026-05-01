import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Reveal, ScrollFloat } from "@/components/home/motion";
import { BookingPanel } from "@/components/contact/booking-panel";
import { QuoteRequestForm } from "@/components/contact/quote-request-form";
import { getContactPublicContent } from "@/constants/contact/public-content";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { Button } from "@ui/components/ui/button";
import { MarketingPageProps } from "@/interfaces/home/content";

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "contact");
}

export default async function ContactPage({ params }: MarketingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContactPublicContent(locale);

  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.56fr_0.44fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">{content.hero.kicker}</p>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.5rem] lg:text-[5.9rem]">
                  {content.hero.title}
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                {content.hero.intro}
              </Prose>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="h-12 rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
                >
                  <a href="#contact-form">{content.hero.quoteLabel}</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-border bg-white px-6 text-[0.78rem] uppercase tracking-[0.2em] text-foreground hover:bg-white"
                >
                  <a href="#booking">{content.hero.bookingLabel}</a>
                </Button>
              </div>
            </Stack>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <p className="section-kicker">{content.hero.sidePanelTitle}</p>
              <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground">
                {content.hero.signals.map((signal) => (
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
            <QuoteRequestForm locale={locale} />
            <BookingPanel locale={locale} />
          </Grid>
        </Reveal>
      </Section>
    </>
  );
}
