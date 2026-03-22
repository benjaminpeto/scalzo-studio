import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { journalEntries } from "@/components/home/content";
import {
  HoverCard,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";

export function JournalPreview() {
  const [featuredEntry, ...supportingEntries] = journalEntries;

  return (
    <section
      id="journal"
      className="section-shell anchor-offset py-20 lg:py-28"
    >
      <Reveal>
        <ScrollFloat className="mb-12" offset={28}>
          <TextReveal>
            <h2 className="font-display text-[3.1rem] leading-[0.92] tracking-[-0.06em] text-foreground sm:text-[4.2rem] lg:text-[5.2rem]">
              Notre Journal<span className="text-primary">.</span>
            </h2>
          </TextReveal>
          <TextReveal delay={0.08}>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-foreground">
              Insights on branding, strategy, and digital direction.
            </p>
          </TextReveal>
        </ScrollFloat>

        <RevealGroup
          className="grid gap-5 lg:grid-cols-[1.1fr_0.55fr_0.55fr]"
          stagger={0.12}
        >
          <RevealItem>
            <ScrollFloat offset={20}>
              <HoverCard className="h-full">
                <article className="group relative overflow-hidden rounded-[1.85rem] bg-[#111311] text-white">
                  <Image
                    src={featuredEntry.image}
                    alt=""
                    width={1200}
                    height={980}
                    className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
                  <div className="relative flex min-h-[29rem] flex-col justify-end p-7 sm:p-8">
                    <p className="text-sm text-white/68">{featuredEntry.date}</p>
                    <h3 className="mt-4 max-w-xl font-display text-[2.5rem] leading-[0.98] tracking-[-0.05em] text-white sm:text-[3.2rem]">
                      {featuredEntry.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-base leading-7 text-white/74">
                      {featuredEntry.excerpt}
                    </p>
                  </div>
                </article>
              </HoverCard>
            </ScrollFloat>
          </RevealItem>

          {supportingEntries.map((entry) => (
            <RevealItem key={entry.title}>
              <ScrollFloat offset={16}>
                <HoverCard className="h-full">
                  <article className="group flex h-full flex-col rounded-[1.85rem] bg-white p-4 shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4 sm:p-5">
                    <div className="relative overflow-hidden rounded-[1.1rem]">
                      <Image
                        src={entry.image}
                        alt=""
                        width={640}
                        height={460}
                        className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                      {entry.date}
                    </p>
                    <h3 className="mt-4 font-display text-[2rem] leading-[1.02] tracking-[-0.045em] text-foreground">
                      {entry.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                      {entry.excerpt}
                    </p>
                    <div className="mt-auto pt-6">
                      <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-foreground transition-colors group-hover:text-primary">
                        Read note
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </article>
                </HoverCard>
              </ScrollFloat>
            </RevealItem>
          ))}
        </RevealGroup>
      </Reveal>
    </section>
  );
}
