import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "../../lib/utils";

type CaseStudyCardImage = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
};

type CaseStudyCardCta = {
  href: string;
  label?: React.ReactNode;
  ariaLabel?: string;
};

export interface CaseStudyCardProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title: React.ReactNode;
  image: CaseStudyCardImage;
  variant?: "default" | "compact";
  metadata?: React.ReactNode;
  description?: React.ReactNode;
  outcome?: React.ReactNode;
  cta?: CaseStudyCardCta;
  footerAccessory?: React.ReactNode;
}

export function CaseStudyCard({
  title,
  image,
  variant = "default",
  metadata,
  description,
  outcome,
  cta,
  footerAccessory,
  className,
  ...props
}: CaseStudyCardProps) {
  const compact = variant === "compact";
  const ctaAriaLabel =
    cta?.ariaLabel ?? (typeof cta?.label === "string" ? cta.label : undefined);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.7rem] bg-white shadow-[0_8px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4",
        className,
      )}
      {...props}
    >
      <div className="relative overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={900}
          priority={image.priority}
          sizes={image.sizes ?? "(min-width: 1024px) 50vw, 100vw"}
          className="aspect-[1.08] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/18 via-transparent to-transparent" />
      </div>

      <div
        className={cn(
          "border-t border-black/6 px-5 py-4 sm:px-6",
          compact ? "flex items-start justify-between gap-4" : "space-y-3",
        )}
      >
        <div className="min-w-0">
          <h3 className="font-display text-[1.85rem] leading-none tracking-[-0.04em] text-foreground">
            {title}
          </h3>

          {metadata ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {metadata}
            </p>
          ) : null}

          {description ? (
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}

          {outcome ? (
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-foreground">
              {outcome}
            </p>
          ) : null}
        </div>

        {cta ? (
          <Link
            href={cta.href}
            aria-label={ctaAriaLabel}
            className={cn(
              "inline-flex items-center gap-2 text-foreground transition-colors duration-300 hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
              compact
                ? "mt-1 size-8 shrink-0 justify-center rounded-full border border-border group-hover:border-primary"
                : "pt-1 text-sm uppercase tracking-[0.18em]",
            )}
          >
            {compact ? (
              <>
                <span className="sr-only">
                  {cta.label ?? ctaAriaLabel ?? "Read case study"}
                </span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </>
            ) : (
              <>
                {cta.label ?? "Read case study"}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </>
            )}
          </Link>
        ) : footerAccessory ? (
          <div className="mt-1 shrink-0">{footerAccessory}</div>
        ) : null}
      </div>
    </article>
  );
}
