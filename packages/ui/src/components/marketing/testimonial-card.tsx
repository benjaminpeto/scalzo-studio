import * as React from "react";
import Image from "next/image";

import { cn } from "../../lib/utils";

type TestimonialImage = {
  src: string;
  alt: string;
  blurDataUrl?: string;
};

export interface TestimonialCardProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "role"
> {
  quote: React.ReactNode;
  name: React.ReactNode;
  role: React.ReactNode;
  company?: React.ReactNode;
  image?: TestimonialImage;
}

export function TestimonialCard({
  quote,
  name,
  role,
  company,
  image,
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "rounded-[1.7rem] bg-white p-6 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-7",
        className,
      )}
      {...props}
    >
      <blockquote className="font-display text-[1.9rem] leading-[1.02] tracking-[-0.04em] text-foreground sm:text-[2.2rem]">
        {quote}
      </blockquote>
      <div className="mt-7 flex items-center gap-4 border-t border-border/70 pt-5">
        {image ? (
          <div className="relative size-14 overflow-hidden rounded-full bg-muted">
            <Image
              alt={image.alt}
              blurDataURL={image.blurDataUrl}
              className="h-full w-full object-cover"
              fill
              placeholder={image.blurDataUrl ? "blur" : "empty"}
              sizes="56px"
              src={image.src}
            />
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            {name}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {role}
            {company ? <> · {company}</> : null}
          </p>
        </div>
      </div>
    </article>
  );
}
