import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal, ScrollFloat, TextReveal } from "@/components/home/motion";
import { Button } from "@ui/components/ui/button";

export function CtaBand() {
  return (
    <section id="quote" className="section-shell anchor-offset py-20 lg:py-28">
      <Reveal className="grid gap-8 lg:grid-cols-[0.48fr_0.52fr] lg:items-center">
        <div id="contact">
        <ScrollFloat offset={30}>
          <p className="section-kicker">Brand Organiser</p>
          <TextReveal>
            <h2 className="mt-5 font-display text-[2.7rem] leading-[0.95] tracking-[-0.05em] text-foreground sm:text-[3.6rem] lg:text-[4.4rem]">
              Ready to sharpen the homepage and the brand behind it?
            </h2>
          </TextReveal>
          <TextReveal delay={0.08}>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              The first step is a direct conversation about the current page, the
              level of ambition, and what needs to feel more premium or more
              convincing.
            </p>
          </TextReveal>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-13 rounded-full bg-[#0d0f0c] px-7 text-[0.78rem] uppercase tracking-[0.22em] text-white hover:bg-[#191c18]"
            >
              <Link href="#contact">
                Book a discovery call
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-13 rounded-full border-border bg-white px-7 text-[0.78rem] uppercase tracking-[0.22em] text-foreground hover:bg-white"
            >
              <Link href="#journal">Read the journal</Link>
            </Button>
          </div>
        </ScrollFloat>
        </div>

        <ScrollFloat offset={38}>
          <div className="rounded-[1.8rem] bg-white p-6 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-8">
          <p className="section-kicker">Quick brief</p>
          <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground">
            <p>What is the business trying to look like?</p>
            <p>Where does the current homepage lose confidence?</p>
            <p>What should a better first impression help you win?</p>
          </div>
          <div className="mt-8 border-t border-border/70 pt-5">
            <Link
              href="mailto:hello@scalzostudio.com"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary"
            >
              hello@scalzostudio.com
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          </div>
        </ScrollFloat>
      </Reveal>
    </section>
  );
}
