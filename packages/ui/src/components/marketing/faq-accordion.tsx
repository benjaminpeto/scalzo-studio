"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "../../lib/utils";

type WrapperProps = {
  children: React.ReactNode;
  className?: string;
};

type WrapperComponent = React.ComponentType<WrapperProps>;

export type FaqAccordionItem = {
  question: string;
  answer: React.ReactNode;
};

export interface FaqAccordionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  items: readonly FaqAccordionItem[];
  defaultOpenIndex?: number | null;
  emptyMessage?: React.ReactNode;
  itemWrapper?: WrapperComponent;
}

function DefaultWrapper({ children, className }: WrapperProps) {
  if (!className) {
    return <>{children}</>;
  }

  return <div className={className}>{children}</div>;
}

export function FaqAccordion({
  items,
  defaultOpenIndex = 0,
  emptyMessage = "No questions available right now.",
  itemWrapper: ItemWrapper = DefaultWrapper,
  className,
  ...props
}: FaqAccordionProps) {
  const resolvedDefaultIndex =
    defaultOpenIndex != null &&
    defaultOpenIndex >= 0 &&
    defaultOpenIndex < items.length
      ? defaultOpenIndex
      : null;
  const [openIndex, setOpenIndex] = React.useState<number | null>(
    resolvedDefaultIndex,
  );
  const baseId = React.useId();

  if (items.length === 0) {
    return (
      <div className={className} {...props}>
        <div className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4">
          <p className="text-base leading-7 text-muted-foreground">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <ItemWrapper key={item.question}>
            <div className="rounded-[1.7rem] bg-white p-6 shadow-[0_10px_26px_rgba(27,28,26,0.04)] ring-1 ring-black/4">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-5 rounded-[1.1rem] text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35"
                id={triggerId}
                type="button"
                onClick={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              >
                <span className="font-display text-[1.9rem] leading-none tracking-[-0.04em] text-foreground">
                  {item.question}
                </span>
                <motion.span
                  aria-hidden="true"
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    color: isOpen
                      ? "var(--brand-primary)"
                      : "var(--foreground)",
                  }}
                  className="section-kicker pt-1"
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    animate={{ height: "auto", opacity: 1 }}
                    aria-labelledby={triggerId}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    role="region"
                    transition={{
                      duration: 0.32,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p className="mt-5 border-t border-border/70 pt-5 text-base leading-7 text-muted-foreground">
                      {item.answer}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </ItemWrapper>
        );
      })}
    </div>
  );
}
