import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "../../lib/utils";

type ServiceCardImage = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
};

type ServiceCardCta = {
  href: string;
  label: React.ReactNode;
  ariaLabel?: string;
};

export interface ServiceCardProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title: React.ReactNode;
  indexLabel?: React.ReactNode;
  description?: React.ReactNode;
  items?: readonly React.ReactNode[];
  image?: ServiceCardImage;
  metadata?: React.ReactNode;
  outcome?: React.ReactNode;
  cta?: ServiceCardCta;
  showMarkers?: boolean;
}

export function ServiceCard({
  title,
  indexLabel,
  description,
  items,
  image,
  metadata,
  outcome,
  cta,
  showMarkers = true,
  className,
  ...props
}: ServiceCardProps) {
  const ctaAriaLabel =
    cta?.ariaLabel ?? (typeof cta?.label === "string" ? cta.label : undefined);

  return (
    <article
      className={cn(
        "group rounded-[1.7rem] bg-transparent px-2 py-1",
        className,
      )}
      {...props}
    >
      {showMarkers ? (
        <div className="inline-flex items-center gap-1">
          <span className="inline-block size-2 rounded-full bg-primary" />
          <span className="inline-block size-2 rounded-full bg-primary/70" />
          <span className="inline-block size-2 rounded-full bg-border" />
        </div>
      ) : null}

      {indexLabel ? (
        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {indexLabel}
        </p>
      ) : null}

      {metadata ? (
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {metadata}
        </p>
      ) : null}

      <h3 className="mt-3 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
        {title}
      </h3>

      {image ? (
        <div className="relative mt-5 overflow-hidden rounded-[1.25rem]">
          <Image
            src={image.src}
            alt={image.alt}
            width={900}
            height={720}
            priority={image.priority}
            sizes={image.sizes ?? "(min-width: 1024px) 33vw, 100vw"}
            className="aspect-[1.15] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      {description ? (
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}

      {items?.length ? (
        <ul className="mt-7 space-y-3 text-base leading-7 text-foreground">
          {items.map((item) => (
            <li key={typeof item === "string" ? item : undefined}>{item}</li>
          ))}
        </ul>
      ) : null}

      {outcome ? (
        <p className="mt-6 text-sm uppercase tracking-[0.18em] text-foreground">
          {outcome}
        </p>
      ) : null}

      {cta ? (
        <div className="mt-6">
          <Link
            href={cta.href}
            aria-label={ctaAriaLabel}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {cta.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      ) : null}
    </article>
  );
}
