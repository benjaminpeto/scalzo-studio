import Link from "next/link";

import {
  LegalCard,
  LegalPage,
  LegalSection,
} from "@/components/legal/legal-page";
import { cookiesPageContent } from "@/constants/legal/content";
import { marketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";

export const metadata = marketingRouteMetadata.cookies;

export default function CookiesPage() {
  const { categories, intro, sections } = cookiesPageContent;

  return (
    <LegalPage
      intro={intro.intro}
      kicker={intro.kicker}
      lastUpdated={intro.lastUpdated}
      note={intro.note}
      summary={intro.summary}
      title={intro.title}
    >
      <LegalSection id={sections[0].id} title={sections[0].title}>
        <div className="space-y-5">
          {sections[0].paragraphs.map((paragraph) => (
            <Prose key={paragraph} measure="lg" size="lg">
              {paragraph}
            </Prose>
          ))}
        </div>
      </LegalSection>

      <LegalSection
        title="Cookie categories used or reserved for future features"
        intro="The categories below distinguish between storage that is currently expected to be active and storage that must stay off until the relevant feature and legal basis exist."
      >
        <Grid gap="lg" className="lg:grid-cols-2">
          {categories.map((category) => (
            <LegalCard key={category.title} className="h-full">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="max-w-[24rem] font-display text-[1.8rem] leading-none tracking-[-0.04em] text-foreground">
                  {category.title}
                </h3>
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                    category.status === "Active"
                      ? "bg-[#111311] text-white"
                      : "border border-border/70 bg-white text-muted-foreground"
                  }`}
                >
                  {category.status}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Purpose
                  </p>
                  <Prose className="mt-2" measure="lg" size="sm">
                    {category.purpose}
                  </Prose>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Legal basis
                  </p>
                  <Prose className="mt-2" measure="lg" size="sm" tone="strong">
                    {category.legalBasis}
                  </Prose>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Examples
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                    {category.examples.map((example) => (
                      <li key={example} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/70" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {category.note ? (
                <div className="mt-5 rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
                  <Prose measure="lg" size="sm" tone="strong">
                    {category.note}
                  </Prose>
                </div>
              ) : null}
            </LegalCard>
          ))}
        </Grid>
      </LegalSection>

      <LegalSection id={sections[1].id} title={sections[1].title}>
        <div className="space-y-5">
          {sections[1].paragraphs.map((paragraph) => (
            <Prose key={paragraph} measure="lg" size="lg">
              {paragraph}
            </Prose>
          ))}
          {sections[1].note ? (
            <LegalCard>
              <Prose measure="lg" size="sm" tone="strong">
                {sections[1].note}
              </Prose>
            </LegalCard>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/privacy"
              className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[0.78rem] uppercase tracking-[0.2em] text-background hover:bg-primary"
            >
              Read the privacy notice
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-border bg-white px-6 text-[0.78rem] uppercase tracking-[0.2em] text-foreground hover:bg-white"
            >
              Contact Scalzo Studio
            </Link>
          </div>
        </div>
      </LegalSection>

      <LegalSection id={sections[2].id} title={sections[2].title}>
        <div className="space-y-5">
          {sections[2].paragraphs.map((paragraph) => (
            <Prose key={paragraph} measure="lg" size="lg">
              {paragraph}
            </Prose>
          ))}
        </div>
      </LegalSection>
    </LegalPage>
  );
}
