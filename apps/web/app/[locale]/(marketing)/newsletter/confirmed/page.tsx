import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";

import { getNewsletterPublicContent } from "@/constants/newsletter/public-content";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { Button } from "@ui/components/ui/button";
import { MarketingPageProps } from "@/interfaces/home/content";

interface NewsletterConfirmedPageProps extends MarketingPageProps {
  searchParams: Promise<{ status?: string }>;
}

type NewsletterConfirmationStatus =
  | "confirmed"
  | "error"
  | "expired"
  | "invalid";

export async function generateMetadata({
  params,
}: NewsletterConfirmedPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "newsletterConfirmed");
}

function NewsletterConfirmedContent({
  locale,
  status,
}: {
  locale: "en" | "es";
  status: NewsletterConfirmationStatus;
}) {
  const messages = getNewsletterPublicContent(locale);
  const statusContent = {
    confirmed: {
      body: messages.states.confirmed,
      title: locale === "es" ? "Ya estás en la lista." : "You are on the list.",
    },
    error: {
      body: messages.states.providerError,
      title:
        locale === "es"
          ? "No se ha podido completar la suscripción."
          : "The signup could not be completed.",
    },
    expired: {
      body: messages.states.expired,
      title:
        locale === "es"
          ? "Ese enlace de confirmación ha caducado."
          : "That confirmation link has expired.",
    },
    invalid: {
      body: messages.states.invalid,
      title:
        locale === "es"
          ? "Ese enlace de confirmación no es válido."
          : "That confirmation link is not valid.",
    },
  } as const;
  const content = statusContent[status];

  return (
    <Section spacing="tight" className="overflow-hidden pb-20 lg:pb-24">
      <Grid gap="2xl" className="lg:grid-cols-[0.56fr_0.44fr] lg:items-start">
        <Stack gap="lg">
          <p className="section-kicker">Newsletter</p>
          <h1 className="max-w-5xl font-display text-[3.2rem] leading-[0.9] tracking-[-0.06em] text-foreground sm:text-[4.2rem] lg:text-[5.2rem]">
            {content.title}
          </h1>
          <Prose size="lg" measure="lg">
            {content.body}
          </Prose>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="h-12 rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
            >
              <Link href="/insights">
                {locale === "es" ? "Ver artículos" : "Browse insights"}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-border bg-white px-6 text-[0.78rem] uppercase tracking-[0.2em] text-foreground hover:bg-white"
            >
              <Link href="/">
                {locale === "es" ? "Volver al inicio" : "Return home"}
              </Link>
            </Button>
          </div>
        </Stack>

        <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
          <p className="section-kicker">
            {locale === "es" ? "Qué esperar" : "What to expect"}
          </p>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            {locale === "es"
              ? "El newsletter es para notas editoriales ocasionales sobre posicionamiento, estructura de página y pensamiento de producto. Sin una cadencia pesada de automatización."
              : "The newsletter is for occasional editorial notes on positioning, page structure, and product thinking. No automation-heavy cadence."}
          </p>
        </div>
      </Grid>
    </Section>
  );
}

async function ResolvedNewsletterConfirmedPage({
  params,
  searchParams,
}: NewsletterConfirmedPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const status =
    resolvedSearchParams.status &&
    ["confirmed", "error", "expired", "invalid"].includes(
      resolvedSearchParams.status,
    )
      ? (resolvedSearchParams.status as NewsletterConfirmationStatus)
      : "invalid";

  return (
    <NewsletterConfirmedContent
      locale={locale === "es" ? "es" : "en"}
      status={status}
    />
  );
}

export default async function NewsletterConfirmedPage(
  props: NewsletterConfirmedPageProps,
) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return (
    <Suspense
      fallback={
        <NewsletterConfirmedContent
          locale={locale === "es" ? "es" : "en"}
          status="invalid"
        />
      }
    >
      <ResolvedNewsletterConfirmedPage {...props} />
    </Suspense>
  );
}
