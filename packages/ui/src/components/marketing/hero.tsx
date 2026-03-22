import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, MoveRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
};

type WrapperComponent = React.ComponentType<WrapperProps>;

type HeroShowcaseItem = {
  src: string;
  alt?: string;
  priority?: boolean;
};

type HeroPrimaryAction = {
  href: string;
  label: string;
};

type HeroSecondaryAction = {
  href: string;
  ariaLabel: string;
};

function DefaultWrapper({ children, className }: WrapperProps) {
  if (!className) {
    return <>{children}</>;
  }

  return <div className={className}>{children}</div>;
}

export interface MarketingHeroProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  kicker: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  primaryAction: HeroPrimaryAction;
  secondaryAction?: HeroSecondaryAction;
  showcase: readonly HeroShowcaseItem[];
  rootWrapper?: WrapperComponent;
  contentGroupWrapper?: WrapperComponent;
  contentItemWrapper?: WrapperComponent;
  showcaseItemWrapper?: WrapperComponent;
  showcaseCardWrapper?: WrapperComponent;
}

export function MarketingHero({
  kicker,
  title,
  description,
  primaryAction,
  secondaryAction,
  showcase,
  rootWrapper: RootWrapper = DefaultWrapper,
  contentGroupWrapper: ContentGroupWrapper = DefaultWrapper,
  contentItemWrapper: ContentItemWrapper = DefaultWrapper,
  showcaseItemWrapper: ShowcaseItemWrapper = DefaultWrapper,
  showcaseCardWrapper: ShowcaseCardWrapper = DefaultWrapper,
  className,
  ...props
}: MarketingHeroProps) {
  return (
    <section
      className={cn(
        "anchor-offset relative z-20 mx-auto w-full max-w-475 p-1",
        className,
      )}
      {...props}
    >
      <RootWrapper>
        <div className="flex h-[calc(100svh-4.5rem-0.5rem)] max-h-[calc(100svh-4.5rem-0.5rem)] flex-col justify-between overflow-hidden rounded-4xl bg-[#0d0f0c] px-5 pb-5 pt-7 text-white sm:px-7 lg:px-10 lg:pb-6 lg:pt-8">
          <ContentGroupWrapper className="mx-auto text-center">
            <ContentItemWrapper>
              <p className="section-kicker text-white/58">{kicker}</p>
            </ContentItemWrapper>
            <ContentItemWrapper>
              <h1 className="mx-auto mt-6 max-w-[15ch] text-balance font-display text-[3rem] leading-[0.9] tracking-[-0.055em] text-white sm:text-[4rem] lg:text-[5.35rem] xl:text-[6rem]">
                {title}
              </h1>
            </ContentItemWrapper>
            <ContentItemWrapper>
              <p className="mx-auto mt-4 max-w-3xl text-balance text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                {description}
              </p>
            </ContentItemWrapper>
            <ContentItemWrapper>
              <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-14 rounded-full bg-primary px-8 text-[0.8rem] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/92 focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  <Link href={primaryAction.href}>
                    {primaryAction.label}
                    <MoveRight aria-hidden="true" className="size-4" />
                  </Link>
                </Button>
                {secondaryAction ? (
                  <Link
                    aria-label={secondaryAction.ariaLabel}
                    className="inline-flex size-12 items-center justify-center rounded-full border border-white/28 text-white transition-transform duration-300 hover:scale-105 hover:border-primary hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/35"
                    href={secondaryAction.href}
                  >
                    <ArrowDownRight aria-hidden="true" className="size-5" />
                  </Link>
                ) : null}
              </div>
            </ContentItemWrapper>
          </ContentGroupWrapper>

          <div className="mt-8 grid gap-2 md:grid-cols-4">
            {showcase.map((image, index) => (
              <ShowcaseItemWrapper key={`${image.src}-${index}`}>
                <ShowcaseCardWrapper className="h-full">
                  <div className="group relative overflow-hidden rounded-[1.4rem]">
                    <Image
                      alt={image.alt ?? ""}
                      className="aspect-[1.34] w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      height={540}
                      priority={image.priority ?? index === 0}
                      src={image.src}
                      width={860}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                  </div>
                </ShowcaseCardWrapper>
              </ShowcaseItemWrapper>
            ))}
          </div>
        </div>
      </RootWrapper>
    </section>
  );
}
