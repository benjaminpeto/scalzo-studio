import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "../../lib/utils";

type BlogPostCardImage = {
  src: string;
  alt: string;
  blurDataUrl?: string;
  height: number;
  priority?: boolean;
  sizes?: string;
  width: number;
};

type BlogPostCardCta = {
  href: string;
  label: React.ReactNode;
  ariaLabel?: string;
};

export interface BlogPostCardProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title: React.ReactNode;
  variant?: "default" | "featured";
  metadata?: React.ReactNode;
  excerpt?: React.ReactNode;
  image?: BlogPostCardImage;
  cta?: BlogPostCardCta;
  footerAccessory?: React.ReactNode;
}

export function BlogPostCard({
  title,
  variant = "default",
  metadata,
  excerpt,
  image,
  cta,
  footerAccessory,
  className,
  ...props
}: BlogPostCardProps) {
  const featured = variant === "featured";
  const ctaAriaLabel =
    cta?.ariaLabel ?? (typeof cta?.label === "string" ? cta.label : undefined);

  if (featured) {
    return (
      <article
        className={cn(
          "group relative overflow-hidden rounded-[1.85rem] bg-[#111311] text-white",
          className,
        )}
        {...props}
      >
        {image ? (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={image.priority}
              placeholder={image.blurDataUrl ? "blur" : "empty"}
              blurDataURL={image.blurDataUrl}
              sizes={image.sizes ?? "(min-width: 1024px) 55vw, 100vw"}
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-black/10" />
          </>
        ) : null}

        <div className="relative flex min-h-116 flex-col justify-end p-7 sm:p-8">
          {metadata ? (
            <p className="text-sm text-white/68">{metadata}</p>
          ) : null}
          <h3 className="mt-4 max-w-xl font-display text-[2.5rem] leading-[0.98] tracking-[-0.05em] text-white sm:text-[3.2rem]">
            {title}
          </h3>
          {excerpt ? (
            <p className="mt-5 max-w-xl text-base leading-7 text-white/74">
              {excerpt}
            </p>
          ) : null}
          {cta ? (
            <div className="mt-6">
              <Link
                href={cta.href}
                aria-label={ctaAriaLabel}
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {cta.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-[1.85rem] bg-white p-4 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-5",
        className,
      )}
      {...props}
    >
      {image ? (
        <div className="relative overflow-hidden rounded-[1.1rem]">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            priority={image.priority}
            placeholder={image.blurDataUrl ? "blur" : "empty"}
            blurDataURL={image.blurDataUrl}
            sizes={image.sizes ?? "(min-width: 1024px) 25vw, 100vw"}
            className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </div>
      ) : null}

      {metadata ? (
        <p className="mt-6 text-sm text-muted-foreground">{metadata}</p>
      ) : null}
      <h3 className="mt-4 font-display text-[2rem] leading-[1.02] tracking-[-0.045em] text-foreground">
        {title}
      </h3>
      {excerpt ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {excerpt}
        </p>
      ) : null}

      {cta ? (
        <div className="mt-auto pt-6">
          <Link
            href={cta.href}
            aria-label={ctaAriaLabel}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {cta.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : footerAccessory ? (
        <div className="mt-auto pt-6">{footerAccessory}</div>
      ) : null}
    </article>
  );
}
