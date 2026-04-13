import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getFallbackWorkDetailPageData } from "@/actions/work/helpers";
import { getResolvedWorkDetailRouteData } from "@/actions/work/get-resolved-work-detail-route-data";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
} from "@/components/home/motion";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";
import { CaseStudyViewTracker } from "@/components/tracking/case-study-view-tracker";
import { JsonLd } from "@/lib/seo/json-ld";
import {
  buildNotFoundRouteMetadata,
  buildRouteMetadata,
} from "@/lib/seo/route-metadata";
import { buildCreativeWorkSchema } from "@/lib/seo/schema";
import { buildCmsImageProps, cmsImageSizes } from "@/lib/media-assets/shared";
import { MarketingCtaBand } from "@ui/components/marketing/cta-band";
import { TestimonialCard } from "@ui/components/marketing/testimonial-card";

interface WorkDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { detailPageData, isPreview } =
    await getResolvedWorkDetailRouteData(slug);

  if (!detailPageData) {
    return buildNotFoundRouteMetadata();
  }

  return buildRouteMetadata({
    canonical: `/work/${detailPageData.slug}`,
    description:
      detailPageData.seoDescription ??
      detailPageData.description ??
      detailPageData.outcomes,
    noIndex: isPreview,
    publishedTime: detailPageData.publishedAt,
    socialFallbackPath: `/work/${detailPageData.slug}/opengraph-image`,
    socialImage: detailPageData.image.src,
    socialImageAlt: detailPageData.image.alt,
    title:
      detailPageData.seoTitle ??
      `${detailPageData.title} | Work | Scalzo Studio`,
    updatedTime: detailPageData.updatedAt,
  });
}

async function WorkDetailContent({ slug }: { slug: string }) {
  const { detailPageData, isPreview } =
    await getResolvedWorkDetailRouteData(slug);

  if (!detailPageData) {
    notFound();
  }

  return (
    <WorkDetailLayout
      detailPageData={detailPageData}
      isPreview={isPreview}
      previewExitHref={
        isPreview
          ? `/api/preview/disable?next=${encodeURIComponent(
              detailPageData.published
                ? `/work/${detailPageData.slug}`
                : "/admin/work",
            )}`
          : null
      }
    />
  );
}

function WorkDetailLayout({
  detailPageData,
  isPreview,
  previewExitHref,
}: {
  detailPageData: Awaited<ReturnType<typeof getFallbackWorkDetailPageData>>;
  isPreview: boolean;
  previewExitHref: string | null;
}) {
  const [leadVisual, ...secondaryVisuals] = detailPageData.visuals;

  return (
    <>
      <JsonLd
        data={buildCreativeWorkSchema({
          description: detailPageData.description,
          image: detailPageData.image.src,
          modifiedTime: detailPageData.updatedAt,
          publishedTime: detailPageData.publishedAt,
          services: detailPageData.services,
          slug: detailPageData.slug,
          title: detailPageData.title,
        })}
      />
      <CaseStudyViewTracker
        slug={detailPageData.slug}
        title={detailPageData.title}
      />
      {isPreview ? (
        <Section spacing="tight" className="pb-0">
          <div className="rounded-[1.35rem] border border-[#735c00]/20 bg-[linear-gradient(135deg,rgba(252,205,3,0.18),rgba(255,255,255,0.94))] px-5 py-4 shadow-[0_12px_30px_rgba(115,92,0,0.08)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#735c00]">
                  Admin preview mode
                </p>
                <p className="mt-1 text-sm leading-6 text-foreground">
                  Viewing the latest saved case-study state for this route. This
                  preview is only visible to admins with preview mode enabled.
                </p>
              </div>
              {previewExitHref ? (
                <Link
                  href={previewExitHref}
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-full border border-border/70 bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-card"
                >
                  Exit preview
                </Link>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Reveal>
          <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">Case study</p>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Link
                  href="/work"
                  className="transition-colors hover:text-foreground"
                >
                  Work
                </Link>
                <span aria-hidden="true">/</span>
                <span>{detailPageData.title}</span>
              </div>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.5rem] lg:text-[5.9rem]">
                  {detailPageData.title}
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                {detailPageData.description}
              </Prose>
              <div className="flex flex-wrap gap-2 pt-2">
                {detailPageData.industry ? (
                  <span className="rounded-full border border-border/70 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {detailPageData.industry}
                  </span>
                ) : null}
                {detailPageData.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-border/70 bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </Stack>

            <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
              <p className="section-kicker">Key outcome</p>
              <p className="mt-5 font-display text-[2.4rem] leading-[0.95] tracking-[-0.05em] text-foreground sm:text-[3rem]">
                {detailPageData.metric}
              </p>
              <div className="mt-6 grid gap-5 border-t border-border/70 pt-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Client
                  </p>
                  <p className="mt-3 text-base leading-7 text-foreground">
                    {detailPageData.clientName ?? "Confidential client"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Context
                  </p>
                  <p className="mt-3 text-base leading-7 text-foreground">
                    {detailPageData.metadata}
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        </Reveal>
      </Section>

      <Section spacing="tight">
        <Reveal>
          <Grid cols="two" gap="md">
            <article className="rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-7">
              <p className="section-kicker">Challenge</p>
              <h2 className="mt-4 font-display text-[2.4rem] leading-[0.95] tracking-[-0.045em] text-foreground sm:text-[3rem]">
                What had to change first.
              </h2>
              <Prose size="lg" measure="md" className="mt-5">
                {detailPageData.challenge}
              </Prose>
            </article>

            <article className="rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-7">
              <p className="section-kicker">Approach</p>
              <h2 className="mt-4 font-display text-[2.4rem] leading-[0.95] tracking-[-0.045em] text-foreground sm:text-[3rem]">
                How the direction was translated into the page.
              </h2>
              <Prose size="lg" measure="md" className="mt-5">
                {detailPageData.approach}
              </Prose>
            </article>
          </Grid>
        </Reveal>
      </Section>

      <Section spacing="tight">
        <Reveal>
          <Grid
            gap="2xl"
            className="lg:grid-cols-[0.36fr_0.64fr] lg:items-start"
          >
            <Stack gap="sm">
              <p className="section-kicker">Outcomes</p>
              <h2 className="font-display text-[2.7rem] leading-[0.94] tracking-[-0.055em] text-foreground sm:text-[3.6rem] lg:text-[4.4rem]">
                Where the commercial shift becomes visible.
              </h2>
            </Stack>

            <Stack gap="lg">
              <Prose size="lg" tone="strong" measure="lg">
                {detailPageData.outcomes}
              </Prose>

              <RevealGroup
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                stagger={0.08}
              >
                {detailPageData.metrics.map((metric) => (
                  <RevealItem key={`${metric.label}-${metric.value}`}>
                    <article className="rounded-[1.5rem] border border-border/70 bg-white px-5 py-5 shadow-[0_12px_34px_rgba(27,28,26,0.04)]">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {metric.label}
                      </p>
                      <p className="mt-4 font-display text-[2rem] leading-[0.96] tracking-[-0.04em] text-foreground">
                        {metric.value}
                      </p>
                    </article>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Stack>
          </Grid>
        </Reveal>
      </Section>

      <Section spacing="tight" surface="inverse">
        <Reveal>
          <Stack gap="xl">
            <Grid
              gap="xl"
              className="lg:grid-cols-[0.38fr_0.62fr] lg:items-end"
            >
              <Stack gap="sm">
                <p className="section-kicker text-white/60">Visuals</p>
                <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-white sm:text-[3.8rem] lg:text-[4.8rem]">
                  The live surface where strategy becomes visible.
                </h2>
              </Stack>
              <Prose measure="md" tone="inverse">
                The visuals below show how hierarchy, proof, and pacing were
                shaped to make the page feel more intentional once the direction
                moved into a live interface.
              </Prose>
            </Grid>

            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              {leadVisual ? (
                <figure className="overflow-hidden rounded-[1.9rem] bg-white/8 ring-1 ring-white/12">
                  <Image
                    src={leadVisual.src}
                    alt={leadVisual.alt}
                    width={leadVisual.width}
                    height={leadVisual.height}
                    sizes={cmsImageSizes.caseStudyDetailLead}
                    {...buildCmsImageProps(leadVisual)}
                    className="aspect-[1.18] w-full object-cover"
                  />
                  <figcaption className="border-t border-white/12 px-5 py-4 text-sm leading-6 text-white/72 sm:px-6">
                    {leadVisual.caption}
                  </figcaption>
                </figure>
              ) : null}

              <div className="grid gap-5">
                {secondaryVisuals.map((visual) => (
                  <figure
                    key={`${visual.src}-${visual.caption}`}
                    className="overflow-hidden rounded-[1.9rem] bg-white/8 ring-1 ring-white/12"
                  >
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      width={visual.width}
                      height={visual.height}
                      sizes={cmsImageSizes.caseStudyDetailSecondary}
                      {...buildCmsImageProps(visual)}
                      className="aspect-[1.2] w-full object-cover"
                    />
                    <figcaption className="border-t border-white/12 px-5 py-4 text-sm leading-6 text-white/72 sm:px-6">
                      {visual.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </Stack>
        </Reveal>
      </Section>

      <Section spacing="tight">
        <Reveal>
          <Grid
            gap="2xl"
            className="lg:grid-cols-[0.34fr_0.66fr] lg:items-start"
          >
            <Stack gap="sm">
              <p className="section-kicker">Testimonial</p>
              <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.8rem]">
                What the change felt like from the client side.
              </h2>
            </Stack>

            <TestimonialCard
              quote={detailPageData.testimonial.quote}
              name={detailPageData.testimonial.name}
              role={detailPageData.testimonial.role}
              company={detailPageData.testimonial.company}
              className="h-full rounded-[1.9rem] bg-[rgba(250,248,241,0.96)]"
            />
          </Grid>
        </Reveal>
      </Section>

      <MarketingCtaBand
        id="contact"
        briefItems={[
          `What needs the same level of clarity as ${detailPageData.title.toLowerCase()}?`,
          "Which page or launch currently feels weaker than the business behind it?",
          "What commercial outcome should the next redesign make easier to win?",
        ]}
        briefKicker="Next step"
        className="pb-24"
        description="If this case study feels close to the shift you need, the next step is a direct conversation about the friction, the ambition, and the page outcome the next project should create."
        email={{
          href: "mailto:hello@scalzostudio.com",
          label: "hello@scalzostudio.com",
        }}
        kicker="Scalzo Studio"
        primaryAction={{
          href: "/#contact",
          label: "Start a project conversation",
        }}
        secondaryAction={{ href: "/work", label: "Back to work" }}
        title="Need the next page or launch to create this kind of first impression?"
      />
    </>
  );
}

function WorkDetailFallback({ slug }: { slug: string }) {
  const detailPageData = getFallbackWorkDetailPageData(slug);
  const [leadVisual, ...secondaryVisuals] = detailPageData.visuals;

  return (
    <>
      <Section spacing="tight" className="overflow-hidden pb-14 lg:pb-18">
        <Grid gap="2xl" className="lg:grid-cols-[0.58fr_0.42fr] lg:items-end">
          <Stack gap="lg">
            <div className="h-4 w-24 rounded-full bg-black/8" />
            <div className="h-4 w-36 rounded-full bg-black/6" />
            <div className="space-y-3">
              <div className="h-16 max-w-4xl rounded-[1.6rem] bg-black/8 sm:h-20 lg:h-24" />
              <div className="h-16 max-w-3xl rounded-[1.6rem] bg-black/6 sm:h-20 lg:h-24" />
            </div>
            <div className="space-y-3">
              <div className="h-4 max-w-2xl rounded-full bg-black/7" />
              <div className="h-4 max-w-xl rounded-full bg-black/5" />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {detailPageData.services.map((service) => (
                <div
                  key={service}
                  className="h-7 w-24 rounded-full bg-black/6"
                />
              ))}
            </div>
          </Stack>

          <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/80 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
            <div className="h-4 w-28 rounded-full bg-black/8" />
            <div className="mt-5 h-10 w-40 rounded-[1rem] bg-black/8" />
            <div className="mt-6 grid gap-5 border-t border-border/70 pt-5 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="h-4 w-16 rounded-full bg-black/6" />
                <div className="h-4 w-28 rounded-full bg-black/5" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-20 rounded-full bg-black/6" />
                <div className="h-4 w-36 rounded-full bg-black/5" />
              </div>
            </div>
          </div>
        </Grid>
      </Section>

      <Section spacing="tight">
        <Grid cols="two" gap="md">
          {["Challenge", "Approach"].map((label) => (
            <article
              key={label}
              className="rounded-[1.8rem] bg-white p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-7"
            >
              <div className="h-4 w-24 rounded-full bg-black/6" />
              <div className="mt-4 h-10 w-72 rounded-[1rem] bg-black/8" />
              <div className="mt-5 space-y-3">
                <div className="h-4 rounded-full bg-black/7" />
                <div className="h-4 max-w-[90%] rounded-full bg-black/5" />
                <div className="h-4 max-w-[82%] rounded-full bg-black/4" />
              </div>
            </article>
          ))}
        </Grid>
      </Section>

      <Section spacing="tight">
        <Grid gap="2xl" className="lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded-full bg-black/8" />
            <div className="h-12 w-80 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-black/7" />
              <div className="h-4 max-w-[92%] rounded-full bg-black/5" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {detailPageData.metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-[1.5rem] border border-border/70 bg-white px-5 py-5 shadow-[0_12px_34px_rgba(27,28,26,0.04)]"
                >
                  <div className="h-4 w-20 rounded-full bg-black/6" />
                  <div className="mt-4 h-8 w-24 rounded-[0.9rem] bg-black/8" />
                </article>
              ))}
            </div>
          </div>
        </Grid>
      </Section>

      <Section spacing="tight" surface="inverse">
        <Stack gap="xl">
          <Grid gap="xl" className="lg:grid-cols-[0.38fr_0.62fr] lg:items-end">
            <div className="space-y-3">
              <div className="h-4 w-20 rounded-full bg-white/12" />
              <div className="h-12 w-72 rounded-[1rem] bg-white/12 sm:h-14 lg:h-16" />
            </div>
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-white/12" />
              <div className="h-4 max-w-[90%] rounded-full bg-white/10" />
            </div>
          </Grid>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            {leadVisual ? (
              <div className="overflow-hidden rounded-[1.9rem] bg-white/8 ring-1 ring-white/12">
                <div className="aspect-[1.18] w-full bg-white/10" />
              </div>
            ) : null}

            <div className="grid gap-5">
              {secondaryVisuals.map((visual) => (
                <div
                  key={visual.src}
                  className="overflow-hidden rounded-[1.9rem] bg-white/8 ring-1 ring-white/12"
                >
                  <div className="aspect-[1.2] w-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </Stack>
      </Section>

      <Section spacing="tight">
        <Grid gap="2xl" className="lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded-full bg-black/8" />
            <div className="h-12 w-80 rounded-[1rem] bg-black/8 sm:h-14 lg:h-16" />
          </div>

          <div className="rounded-[1.9rem] bg-white/85 p-6 shadow-[0_16px_44px_rgba(27,28,26,0.04)] ring-1 ring-black/4">
            <div className="space-y-3">
              <div className="h-4 rounded-full bg-black/7" />
              <div className="h-4 max-w-[90%] rounded-full bg-black/5" />
              <div className="h-4 max-w-[78%] rounded-full bg-black/4" />
            </div>
          </div>
        </Grid>
      </Section>
    </>
  );
}

async function ResolvedWorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<WorkDetailFallback slug={slug} />}>
      <WorkDetailContent slug={slug} />
    </Suspense>
  );
}

export default function WorkDetailPage(props: WorkDetailPageProps) {
  return (
    <Suspense fallback={<WorkDetailFallback slug="featured-1" />}>
      <ResolvedWorkDetailPage {...props} />
    </Suspense>
  );
}
