import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/lib/i18n/navigation";

import { LegalPage } from "@/components/legal/legal-page";
import {
  complaintAuthority,
  getLegalSharedContent,
  getPrivacyPageContent,
  getPrivacyPageLabels,
  legalControllerDetails,
} from "@/constants/legal/content";
import { getMarketingRouteMetadata } from "@/lib/seo/marketing-route-metadata";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { MarketingPageProps } from "@/interfaces/home/content";
import { LegalCard } from "@/components/legal/legal-card";
import { LegalSection } from "@/components/legal/legal-section";
import { LegalStatusBadge } from "@/components/legal/legal-status-badge";

export async function generateMetadata({
  params,
}: MarketingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getMarketingRouteMetadata(locale, "privacy");
}

export default async function PrivacyPage({ params }: MarketingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { activities, intro, processors, sections } =
    getPrivacyPageContent(locale);
  const labels = getPrivacyPageLabels(locale);
  const shared = getLegalSharedContent(locale);

  return (
    <LegalPage
      intro={intro.intro}
      kicker={intro.kicker}
      lastUpdated={intro.lastUpdated}
      lastUpdatedLabel={shared.lastUpdatedLabel}
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
          {sections[0].note ? (
            <LegalCard>
              <Prose measure="lg" size="sm" tone="strong">
                {sections[0].note}
              </Prose>
            </LegalCard>
          ) : null}
        </div>
      </LegalSection>

      <LegalSection
        title={labels.activitiesTitle}
        intro={labels.activitiesIntro}
      >
        <Grid gap="lg" className="lg:grid-cols-2">
          {activities.map((activity) => (
            <LegalCard key={activity.title} className="h-full">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="max-w-[24rem] font-display text-[1.8rem] leading-none tracking-[-0.04em] text-foreground">
                  {activity.title}
                </h3>
                <LegalStatusBadge
                  status={activity.status}
                  label={labels.status[activity.status]}
                />
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {labels.lawfulBasisLabel}
                  </p>
                  <Prose className="mt-2" measure="lg" size="sm" tone="strong">
                    {activity.lawfulBasis}
                  </Prose>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {labels.purposeLabel}
                  </p>
                  <Prose className="mt-2" measure="lg" size="sm">
                    {activity.purpose}
                  </Prose>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {labels.dataInvolvedLabel}
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                    {activity.dataCategories.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {labels.recipientsLabel}
                  </p>
                  <Prose className="mt-2" measure="lg" size="sm">
                    {activity.recipients.join(", ")}
                  </Prose>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {labels.retentionLabel}
                  </p>
                  <Prose className="mt-2" measure="lg" size="sm">
                    {activity.retention}
                  </Prose>
                </div>
              </div>

              {activity.note ? (
                <div className="mt-5 rounded-[1.2rem] border border-border/70 bg-white/70 p-4">
                  <Prose measure="lg" size="sm" tone="strong">
                    {activity.note}
                  </Prose>
                </div>
              ) : null}
            </LegalCard>
          ))}
        </Grid>
      </LegalSection>

      <LegalSection
        title={labels.processorsTitle}
        intro={labels.processorsIntro}
      >
        <Grid gap="lg" className="lg:grid-cols-2">
          {processors.map((processor) => (
            <LegalCard key={processor.name} className="h-full">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-display text-[1.7rem] leading-none tracking-[-0.04em] text-foreground">
                  {processor.name}
                </h3>
                <LegalStatusBadge
                  status={processor.status}
                  label={labels.status[processor.status]}
                />
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {processor.role}
              </p>
              <Prose className="mt-3" measure="lg">
                {processor.detail}
              </Prose>
              {processor.note ? (
                <Prose className="mt-4" measure="lg" size="sm" tone="strong">
                  {processor.note}
                </Prose>
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

      <LegalSection id={sections[3].id} title={sections[3].title}>
        <div className="space-y-5">
          {sections[3].paragraphs.map((paragraph) => (
            <Prose key={paragraph} measure="lg" size="lg">
              {paragraph}
            </Prose>
          ))}
          <ul className="space-y-3 text-base leading-7 text-muted-foreground">
            {sections[3].items?.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </LegalSection>

      <LegalSection id={sections[4].id} title={sections[4].title}>
        <div className="space-y-5">
          {sections[4].paragraphs.map((paragraph) => (
            <Prose key={paragraph} measure="lg" size="lg">
              {paragraph}
            </Prose>
          ))}
        </div>
        <Grid gap="lg" className="mt-8 lg:grid-cols-2">
          <LegalCard>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {labels.contactLabel}
            </p>
            <p className="mt-3 font-display text-[1.8rem] leading-none tracking-[-0.04em] text-foreground">
              {legalControllerDetails.email}
            </p>
            <Prose className="mt-3" measure="lg">
              {labels.contactBody}
            </Prose>
            <Link
              href={`mailto:${legalControllerDetails.email}`}
              className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-foreground underline decoration-editorial-underline underline-offset-4"
            >
              {labels.contactCta}
            </Link>
          </LegalCard>

          <LegalCard>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {labels.authorityLabel}
            </p>
            <p className="mt-3 font-display text-[1.8rem] leading-none tracking-[-0.04em] text-foreground">
              {complaintAuthority.label}
            </p>
            <Prose className="mt-3" measure="lg">
              {labels.authorityBody}
            </Prose>
            <a
              href={complaintAuthority.url}
              className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-foreground underline decoration-editorial-underline underline-offset-4"
            >
              {labels.authorityCta}
            </a>
          </LegalCard>
        </Grid>
      </LegalSection>
    </LegalPage>
  );
}
