import Image from "next/image";

import { credibilityStats, studioProfiles } from "@/components/home/content";
import {
  HoverCard,
  Reveal,
  RevealGroup,
  RevealItem,
  ScrollFloat,
} from "@/components/home/motion";

export function StudioCredibility() {
  return (
    <section id="studio" className="section-shell anchor-offset py-20 lg:py-28">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[0.22fr_0.48fr_0.3fr] lg:items-start">
          <div>
            <p className="font-display text-[2.1rem] leading-none tracking-[-0.05em] text-foreground">
              scalzo
            </p>
            <p className="mt-5 max-w-xs text-base leading-7 text-muted-foreground">
              Based in the Canary Islands, the studio helps ambitious brands
              move from visually acceptable to commercially memorable.
            </p>
          </div>

          <div>
            <h2 className="max-w-3xl font-display text-[2.9rem] leading-[0.95] tracking-[-0.055em] text-foreground sm:text-[4.1rem] lg:text-[4.8rem]">
              More than logos, we give your brand a clearer commercial role.
            </h2>
            <div className="mt-10 rounded-4xl bg-white p-6 shadow-[0_10px_30px_rgba(27,28,26,0.04)] ring-1 ring-black/4 sm:p-8">
              <p className="font-display text-[3.4rem] leading-[0.92] tracking-[-0.07em] text-foreground sm:text-[4.9rem]">
                Deux expertises,
                <br />
                une meme vision.
              </p>
            </div>
          </div>

          <RevealGroup className="grid gap-4" stagger={0.1}>
            {studioProfiles.map((profile) => (
              <RevealItem key={profile.title}>
                <ScrollFloat offset={16}>
                  <HoverCard>
                    <article className="group overflow-hidden rounded-[1.7rem] bg-white shadow-[0_10px_30px_rgba(27,28,26,0.05)] ring-1 ring-black/4">
                      <div className="grid min-h-72 grid-cols-[0.58fr_0.42fr]">
                        <div className="p-6">
                          <p className="section-kicker">{profile.role}</p>
                          <h3 className="mt-4 font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                            {profile.title}
                          </h3>
                          <p className="mt-5 text-base leading-7 text-muted-foreground">
                            {profile.description}
                          </p>
                        </div>
                        <div className="relative overflow-hidden">
                          <Image
                            src={profile.image}
                            alt=""
                            width={700}
                            height={900}
                            className="h-full w-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        </div>
                      </div>
                    </article>
                  </HoverCard>
                </ScrollFloat>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3" stagger={0.08}>
          {credibilityStats.map((item) => (
            <RevealItem key={item.value}>
              <div className="rounded-[1.5rem] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(27,28,26,0.04)] ring-1 ring-black/4">
                <p className="font-display text-[2rem] leading-none tracking-[-0.04em] text-foreground">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Reveal>
    </section>
  );
}
