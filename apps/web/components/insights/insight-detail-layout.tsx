import Image from "next/image";
import Link from "next/link";

import { Reveal, ScrollFloat, TextReveal } from "@/components/home/motion";
import { InsightMarkdown } from "@/components/insights/insight-markdown";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import type { InsightDetailPageData } from "@/interfaces/insights/content";
import { publicEnv } from "@/lib/env/public";
import { JsonLd } from "@/lib/seo/json-ld";
import { buildArticleSchema } from "@/lib/seo/schema";
import { buildCmsImageProps, cmsImageSizes } from "@/lib/media-assets/shared";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

interface InsightDetailLayoutProps {
  detailPageData: InsightDetailPageData;
  isPreview: boolean;
  previewExitHref: string | null;
}

function buildArticleUrl(slug: string) {
  return new URL(`/insights/${slug}`, publicEnv.siteUrl).toString();
}

function buildShareLinks(title: string, articleUrl: string) {
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "LinkedIn",
    },
    {
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: "X",
    },
    {
      href: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
        `${title}\n\n${articleUrl}`,
      )}`,
      label: "Email",
    },
  ] as const;
}

function InlineArticleCta({ title }: { title: string }) {
  return (
    <div className="surface-grain rounded-[1.9rem] border border-border/70 bg-white/85 p-6 shadow-[0_18px_52px_rgba(27,28,26,0.05)] sm:p-8">
      <p className="section-kicker">Next step</p>
      <h2 className="mt-5 max-w-2xl font-display text-[2.4rem] leading-[0.95] tracking-[-0.05em] text-foreground sm:text-[3rem]">
        Want to turn {title.toLowerCase()} into a sharper page decision?
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
        The useful next move is usually not another abstract brainstorm. It is a
        direct review of the current page, the trust gap, and the sequence that
        needs to feel clearer.
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/#contact"
          className="inline-flex items-center rounded-full bg-foreground px-5 py-3 text-xs uppercase tracking-[0.18em] text-background transition-colors hover:bg-primary"
        >
          Start a conversation
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center rounded-full border border-border/70 bg-white px-5 py-3 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground"
        >
          Browse services
        </Link>
      </div>
    </div>
  );
}

export default function InsightDetailLayout({
  detailPageData,
  isPreview,
  previewExitHref,
}: InsightDetailLayoutProps) {
  const articleUrl = buildArticleUrl(detailPageData.slug);
  const shareLinks = buildShareLinks(detailPageData.title, articleUrl);

  return (
    <>
      <JsonLd
        data={buildArticleSchema({
          description: detailPageData.excerpt,
          image: detailPageData.image.src,
          modifiedTime: detailPageData.updatedAt,
          publishedTime: detailPageData.publishedAt,
          slug: detailPageData.slug,
          title: detailPageData.title,
        })}
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
                  Viewing the latest saved article state for this route. This
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
          <Grid gap="2xl" className="lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
            <Stack gap="lg">
              <p className="section-kicker">Insight article</p>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <Link
                  href="/insights"
                  className="transition-colors hover:text-foreground"
                >
                  Insights
                </Link>
                <span aria-hidden="true">/</span>
                <span>{detailPageData.title}</span>
              </div>
              <ScrollFloat offset={24}>
                <h1 className="max-w-5xl font-display text-[3.4rem] leading-[0.9] tracking-[-0.065em] text-foreground sm:text-[4.5rem] lg:text-[5.8rem]">
                  {detailPageData.title}
                </h1>
              </ScrollFloat>
              <Prose size="lg" measure="lg">
                {detailPageData.excerpt}
              </Prose>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>{detailPageData.date}</span>
                <span aria-hidden="true">/</span>
                <span>{detailPageData.tags.join(" / ")}</span>
              </div>
            </Stack>

            <div className="overflow-hidden rounded-4xl border border-border/70 bg-[rgba(250,248,241,0.72)] p-3 shadow-[0_20px_60px_rgba(27,28,26,0.08)]">
              <Image
                src={detailPageData.image.src}
                alt={detailPageData.image.alt}
                width={detailPageData.image.width}
                height={detailPageData.image.height}
                priority
                sizes={cmsImageSizes.articleCover}
                {...buildCmsImageProps(detailPageData.image)}
                className="aspect-[1.1] w-full rounded-[1.35rem] object-cover"
              />
            </div>
          </Grid>
        </Reveal>
      </Section>

      <Section spacing="tight" className="pb-24">
        <Reveal>
          <Grid
            gap="2xl"
            className="lg:grid-cols-[0.31fr_0.69fr] lg:items-start"
          >
            <aside className="space-y-6 lg:sticky lg:top-28">
              <div className="surface-grain rounded-[1.8rem] border border-border/70 bg-white/80 p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)]">
                <p className="section-kicker">Share</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {shareLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-border/70 px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {detailPageData.headings.length ? (
                <div className="surface-grain rounded-[1.8rem] border border-border/70 bg-white/80 p-6 shadow-[0_16px_44px_rgba(27,28,26,0.05)]">
                  <p className="section-kicker">On this page</p>
                  <div className="mt-5 space-y-3">
                    {detailPageData.headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground ${
                          heading.level === 3 ? "pl-4" : ""
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>

            <Stack gap="xl">
              <div className="space-y-8">
                <TextReveal>
                  <h2 className="font-display text-[2.8rem] leading-[0.93] tracking-[-0.055em] text-foreground sm:text-[3.8rem] lg:text-[4.6rem]">
                    The article.
                  </h2>
                </TextReveal>

                <article className="space-y-8">
                  <InsightMarkdown
                    content={detailPageData.content}
                    imageAssets={detailPageData.contentImages}
                  />
                </article>
              </div>

              <InlineArticleCta title={detailPageData.title} />
              <NewsletterSignup placement="insights-detail" />
            </Stack>
          </Grid>
        </Reveal>
      </Section>
    </>
  );
}
