import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { featuredProjects } from "@/components/home/content";
import {
  HoverCard,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
  TextReveal,
} from "@/components/home/motion";

export function FeaturedWork() {
  return (
    <section
      id="projects"
      className="section-shell anchor-offset py-20 lg:py-28"
    >
      <Reveal>
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.24fr_0.52fr_0.24fr] lg:items-end">
          <div className="pt-3">
            <p className="inline-flex items-center gap-2 text-sm text-foreground">
              <span className="inline-block size-2 rounded-full bg-primary" />
              Notre travail
            </p>
          </div>
          <ScrollFloat offset={28}>
            <div>
              <TextReveal>
                <h2 className="font-display text-[4rem] leading-[0.88] tracking-[-0.07em] text-foreground sm:text-[5rem] lg:text-[6.3rem]">
                  Projets<span className="text-primary">.</span>
                </h2>
              </TextReveal>
              <TextReveal delay={0.08}>
                <p className="mt-3 text-xl leading-8 text-foreground">
                  Ambition made visible.
                </p>
              </TextReveal>
            </div>
          </ScrollFloat>
          <ScrollFloat offset={34}>
            <p className="max-w-sm text-base leading-7 text-muted-foreground lg:justify-self-end">
              Editorial case studies with one large visual rhythm, a quieter text
              line, and enough asymmetry to feel designed rather than templated.
            </p>
          </ScrollFloat>
        </div>

        <RevealGroup className="grid gap-4 md:grid-cols-2" stagger={0.12}>
          {featuredProjects.map((project) => (
            <RevealItem key={project.title}>
              <ScrollFloat offset={18}>
                <HoverCard>
                  <article className="group overflow-hidden rounded-[1.7rem] bg-white shadow-[0_8px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4">
                    <div className="relative overflow-hidden">
                      <Image
                        src={project.image}
                        alt={`Abstract placeholder artwork for ${project.title}`}
                        width={1200}
                        height={900}
                        className="aspect-[1.08] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent" />
                    </div>
                    <div className="flex items-start justify-between gap-4 border-t border-black/6 px-5 py-4 sm:px-6">
                      <div>
                        <h3 className="font-display text-[1.85rem] leading-none tracking-[-0.04em] text-foreground">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {project.category} / {project.accent}
                        </p>
                      </div>
                      <span className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 group-hover:border-primary group-hover:text-primary">
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </article>
                </HoverCard>
              </ScrollFloat>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-8 flex justify-end">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-foreground transition-colors hover:text-primary"
          >
            Start a similar project
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
