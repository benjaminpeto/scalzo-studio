import Link from "next/link";
import { Suspense } from "react";

import { newsletterSignupContent } from "@/constants/newsletter/content";
import { marketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { Button } from "@ui/components/ui/button";

interface NewsletterConfirmedPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

const statusContent = {
  confirmed: {
    body: newsletterSignupContent.states.confirmed,
    title: "You are on the list.",
  },
  error: {
    body: newsletterSignupContent.states.providerError,
    title: "The signup could not be completed.",
  },
  expired: {
    body: newsletterSignupContent.states.expired,
    title: "That confirmation link has expired.",
  },
  invalid: {
    body: newsletterSignupContent.states.invalid,
    title: "That confirmation link is not valid.",
  },
} as const;

export const metadata = marketingRouteMetadata.newsletterConfirmed;

function NewsletterConfirmedContent({
  status,
}: {
  status: keyof typeof statusContent;
}) {
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
              <Link href="/insights">Browse insights</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-border bg-white px-6 text-[0.78rem] uppercase tracking-[0.2em] text-foreground hover:bg-white"
            >
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </Stack>

        <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
          <p className="section-kicker">What to expect</p>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            The newsletter is for occasional editorial notes on positioning,
            page structure, and product thinking. No automation-heavy cadence.
          </p>
        </div>
      </Grid>
    </Section>
  );
}

async function ResolvedNewsletterConfirmedPage({
  searchParams,
}: NewsletterConfirmedPageProps) {
  const resolvedSearchParams = await searchParams;
  const status =
    resolvedSearchParams.status && resolvedSearchParams.status in statusContent
      ? (resolvedSearchParams.status as keyof typeof statusContent)
      : "invalid";

  return <NewsletterConfirmedContent status={status} />;
}

export default function NewsletterConfirmedPage(
  props: NewsletterConfirmedPageProps,
) {
  return (
    <Suspense fallback={<NewsletterConfirmedContent status="invalid" />}>
      <ResolvedNewsletterConfirmedPage {...props} />
    </Suspense>
  );
}
