"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { faqItems } from "@/components/home/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/home/motion";

export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-shell anchor-offset py-20 lg:py-28">
      <Reveal className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
        <div>
          <h2 className="font-display text-[4rem] leading-[0.88] tracking-[-0.07em] text-foreground sm:text-[5rem] lg:text-[6rem]">
            FAQ<span className="text-primary">.</span>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
            The final objections are handled here with a minimal accordion
            layout, generous spacing, and a clear route back to contact.
          </p>
        </div>

        <RevealGroup className="grid gap-4" stagger={0.08}>
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <RevealItem key={item.question}>
                <div className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-5 text-left"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === index ? null : index,
                      )
                    }
                  >
                    <span className="font-display text-[1.9rem] leading-none tracking-[-0.04em] text-foreground">
                      {item.question}
                    </span>
                    <motion.span
                      className="section-kicker pt-1"
                      animate={{
                        rotate: isOpen ? 45 : 0,
                        color: isOpen ? "var(--brand-primary)" : "var(--foreground)",
                      }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-5 border-t border-border/70 pt-5 text-base leading-7 text-muted-foreground">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </Reveal>
    </section>
  );
}
