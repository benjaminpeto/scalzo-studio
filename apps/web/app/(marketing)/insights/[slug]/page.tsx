import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Children, Suspense, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

import { Reveal, ScrollFloat, TextReveal } from "@/components/home/motion";
import {
  buildInsightHeadingId,
  getFallbackInsightDetailPageData,
  getInsightDetailPageData,
} from "@/lib/content/insights";
import { publicEnv } from "@/lib/env/public";
import { Grid } from "@ui/components/layout/grid";
import { Prose } from "@ui/components/layout/prose";
import { Section } from "@ui/components/layout/section";
import { Stack } from "@ui/components/layout/stack";

interface InsightDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: InsightDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detailPageData = getFallbackInsightDetailPageData(slug);

  return {
    alternates: {
      canonical: `/insights/${detailPageData.slug}`,
    },
    description:
      detailPageData.seoDescription ??
      detailPageData.excerpt ??
      detailPageData.content,
    title:
      detailPageData.seoTitle ??
      `${detailPageData.title} | Insights | Scalzo Studio`,
  };
}

function flattenMarkdownText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (
        isValidElement<{
          children?: ReactNode;
        }>(child)
      ) {
        return flattenMarkdownText(child.props.children);
      }

      return "";
    })
    .join("");
}

const markdownComponents: Components = {
  a: ({ children, href }) => {
    if (!href) {
      return <>{children}</>;
    }

    if (href.startsWith("/")) {
      return (
        <Link
          href={href}
          className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
      >
        {children}
      </a>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary pl-5 font-display text-[1.55rem] leading-[1.1] tracking-[-0.035em] text-foreground sm:text-[1.85rem]">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded bg-[rgba(27,28,26,0.06)] px-1.5 py-1 text-[0.9em] text-foreground">
        {children}
      </code>
    ),
  h2: ({ children }) => {
    const text = flattenMarkdownText(children);
    const id = buildInsightHeadingId(text);

    return (
      <h2
        id={id}
        className="scroll-mt-28 font-display text-[2.3rem] leading-[0.96] tracking-[-0.05em] text-foreground sm:text-[3rem]"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = flattenMarkdownText(children);
    const id = buildInsightHeadingId(text);

    return (
      <h3
        id={id}
        className="scroll-mt-28 font-display text-[1.8rem] leading-none tracking-[-0.04em] text-foreground sm:text-[2.15rem]"
      >
        {children}
      </h3>
    );
  },
  img: ({ alt = "", src = "" }) =>
    typeof src === "string" && src ? (
      <span className="block overflow-hidden rounded-[1.8rem] bg-[rgba(27,28,26,0.04)]">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="aspect-[1.28] w-full object-cover"
        />
      </span>
    ) : null,
  li: ({ children }) => (
    <li className="pl-2 text-base leading-8 text-muted-foreground sm:text-lg">
      {children}
    </li>
  ),
  ol: ({ children }) => (
    <ol className="space-y-3 pl-6 marker:text-foreground">{children}</ol>
  ),
  p: ({ children }) => (
    <p className="text-base leading-8 text-muted-foreground sm:text-lg">
      {children}
    </p>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-[1.5rem] bg-[rgba(17,19,17,0.96)] p-5 text-sm leading-7 text-white">
      {children}
    </pre>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="space-y-3 pl-6 marker:text-foreground">{children}</ul>
  ),
};

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

async function InsightDetailContent({ slug }: { slug: string }) {
  const detailPageData = await getInsightDetailPageData(slug);

  if (!detailPageData) {
    notFound();
  }

  return <InsightDetailLayout detailPageData={detailPageData} />;
}

function InsightDetailLayout({
  detailPageData,
}: {
  detailPageData: Awaited<ReturnType<typeof getFallbackInsightDetailPageData>>;
}) {
  const articleUrl = buildArticleUrl(detailPageData.slug);
  const shareLinks = buildShareLinks(detailPageData.title, articleUrl);

  return (
    <>
      <Section spacing="roomy" className="overflow-hidden pb-14 lg:pb-18">
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
                src={detailPageData.image}
                alt={`Cover image for ${detailPageData.title}`}
                width={1600}
                height={1100}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
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
                  <ReactMarkdown skipHtml components={markdownComponents}>
                    {detailPageData.content}
                  </ReactMarkdown>
                </article>
              </div>

              <InlineArticleCta title={detailPageData.title} />
            </Stack>
          </Grid>
        </Reveal>
      </Section>
    </>
  );
}

function InsightDetailFallback({ slug }: { slug: string }) {
  return (
    <InsightDetailLayout
      detailPageData={getFallbackInsightDetailPageData(slug)}
    />
  );
}

async function ResolvedInsightDetailPage({ params }: InsightDetailPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<InsightDetailFallback slug={slug} />}>
      <InsightDetailContent slug={slug} />
    </Suspense>
  );
}

export default function InsightDetailPage(props: InsightDetailPageProps) {
  return (
    <Suspense
      fallback={
        <InsightDetailFallback slug="why-premium-service-brands-need-proof-before-explanation" />
      }
    >
      <ResolvedInsightDetailPage {...props} />
    </Suspense>
  );
}
