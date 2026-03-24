import Link from "next/link";

import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

const recoveryLinks = [
  {
    description:
      "Start with the offer structure and service routes if you need the clearest path back into the site.",
    href: "/services",
    label: "Explore services",
  },
  {
    description:
      "Review selected work if you were trying to verify fit, style, or the kind of commercial outcomes the studio focuses on.",
    href: "/work",
    label: "See recent work",
  },
  {
    description:
      "Use the contact route when the page you wanted is gone but the commercial intent is still clear.",
    href: "/contact",
    label: "Open contact",
  },
] as const;

export function SiteNotFound() {
  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-12 lg:pb-16">
        <Grid gap="2xl" className="lg:grid-cols-[0.62fr_0.38fr] lg:items-end">
          <Stack gap="lg">
            <p className="section-kicker">404 / Not found</p>
            <h1 className="max-w-5xl font-display text-[3.5rem] leading-[0.9] tracking-[-0.07em] text-foreground sm:text-[4.7rem] lg:text-[6rem]">
              The page is missing, but the useful routes are still close.
            </h1>
            <Prose size="lg" measure="lg">
              The link may be outdated, the page may have moved, or the URL may
              be incomplete. The recovery paths below are designed to get you
              back to the strongest decision points quickly.
            </Prose>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
              >
                Explore services
              </Link>
              <Link
                href="/"
                className="inline-flex h-12 items-center rounded-full border border-border bg-white px-6 text-[0.78rem] uppercase tracking-[0.2em] text-foreground hover:bg-white"
              >
                Back to home
              </Link>
            </div>
          </Stack>

          <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/84 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Recovery note
            </p>
            <p className="mt-4 font-display text-[2rem] leading-[0.96] tracking-[-0.045em] text-foreground sm:text-[2.5rem]">
              Most dead ends here should resolve through services, work, or a
              direct contact route.
            </p>
            <Prose className="mt-4" measure="md">
              This keeps the 404 state aligned with the studio&apos;s actual
              conversion paths instead of sending visitors into a generic dead
              end.
            </Prose>
          </div>
        </Grid>
      </Section>

      <Section spacing="tight" className="pb-20 lg:pb-24">
        <Grid gap="lg" className="lg:grid-cols-3">
          {recoveryLinks.map((link, index) => (
            <article
              key={link.href}
              className="surface-grain flex h-full flex-col rounded-[1.8rem] border border-border/70 bg-white/80 p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                0{index + 1}
              </p>
              <h2 className="mt-5 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                {link.label}
              </h2>
              <Prose className="mt-4 flex-1" measure="md">
                {link.description}
              </Prose>
              <Link
                href={link.href}
                className="mt-7 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-foreground underline decoration-editorial-underline underline-offset-4"
              >
                Go to {link.label.toLowerCase()}
              </Link>
            </article>
          ))}
        </Grid>
      </Section>
    </>
  );
}
