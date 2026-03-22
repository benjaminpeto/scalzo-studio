import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, MoveRight } from "lucide-react";

import {
  FoldOnScroll,
  HoverCard,
  StaggerGroup,
  StaggerItem,
} from "@/components/home/motion";
import { Button } from "@ui/components/ui/button";

export function Hero() {
  const showcase = [
    "/placeholders/case-coastal.svg",
    "/placeholders/case-product.svg",
    "/placeholders/case-editorial.svg",
    "/placeholders/hero-editorial.svg",
  ] as const;

  return (
    <section className="anchor-offset relative z-20 mx-auto w-full max-w-475 p-1">
      <FoldOnScroll>
        <div className="flex h-[calc(100svh-4.5rem-0.5rem)] max-h-[calc(100svh-4.5rem-0.5rem)] flex-col justify-between overflow-hidden rounded-4xl bg-[#0d0f0c] px-5 pb-5 pt-7 text-white sm:px-7 lg:px-10 lg:pb-6 lg:pt-8">
          <StaggerGroup className="mx-auto text-center">
            <StaggerItem>
              <p className="section-kicker text-white/58">
                Agence de branding strategy first
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mx-auto mt-6 max-w-[15ch] text-balance font-display text-[3rem] leading-[0.9] tracking-[-0.055em] text-white sm:text-[4rem] lg:text-[5.35rem] xl:text-[6rem]">
                Open your brand wider and make the first scroll feel decisive.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mx-auto mt-4 max-w-3xl text-balance text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                Strategy, design, and digital direction fused into a homepage
                that looks more established, reads more clearly, and moves
                people toward contact faster.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-14 rounded-full bg-primary px-8 text-[0.8rem] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/92"
                >
                  <Link href="/#contact">
                    Parlez-nous de votre projet
                    <MoveRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Link
                  href="/#projects"
                  className="inline-flex size-12 items-center justify-center rounded-full border border-white/28 text-white transition-transform duration-300 hover:scale-105 hover:border-primary hover:text-primary"
                  aria-label="Scroll to projects"
                >
                  <ArrowDownRight className="size-5" aria-hidden="true" />
                </Link>
              </div>
            </StaggerItem>
          </StaggerGroup>

          <div className="mt-8 grid gap-2 md:grid-cols-4">
            {showcase.map((image, index) => (
              <StaggerItem key={image}>
                <HoverCard className="h-full">
                  <div className="group relative overflow-hidden rounded-[1.4rem]">
                    <Image
                      src={image}
                      alt=""
                      width={860}
                      height={540}
                      className="aspect-[1.34] w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </div>
        </div>
      </FoldOnScroll>
    </section>
  );
}
