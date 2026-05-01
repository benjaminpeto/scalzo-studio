import { CmsImageAsset } from "@/interfaces/media-assets";
import { flattenMarkdownText } from "@/lib/helpers";
import { buildInsightHeadingId } from "@/lib/insights/markdown";
import {
  createCmsImageAsset,
  cmsImageSizes,
  buildCmsImageProps,
} from "@/lib/media-assets/shared";
import type { Components } from "react-markdown";
import Image from "next/image";
import Link from "next/link";

const ALLOWED_HREF = /^(https?:|\/|#|mailto:)/i;

export function createInsightMarkdownComponents(
  imageAssets: Record<string, CmsImageAsset>,
): Components {
  return {
    a: ({ children, href }) => {
      if (!href || !ALLOWED_HREF.test(href.trim())) {
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
    img: ({ alt = "", src = "" }) => {
      if (typeof src !== "string" || !src) {
        return null;
      }

      const image = imageAssets[src]
        ? {
            ...imageAssets[src],
            alt: alt || imageAssets[src].alt,
          }
        : createCmsImageAsset({
            alt,
            height: 1000,
            src,
            width: 1600,
          });

      return (
        <span className="block overflow-hidden rounded-[1.8rem] bg-[rgba(27,28,26,0.04)]">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={cmsImageSizes.articleInline}
            {...buildCmsImageProps(image)}
            className="aspect-[1.28] w-full object-cover"
          />
        </span>
      );
    },
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
}
