"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useState } from "react";

import { Button } from "@ui/components/ui/button";

export function MobileCtaBar() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 480);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed inset-x-4 bottom-4 z-50 md:hidden"
        >
          <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#0d0f0c] px-4 py-3 text-white shadow-[0_24px_48px_rgba(27,28,26,0.28)]">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/55">
                Start the conversation
              </p>
              <p className="text-sm text-white">Book a calm first call.</p>
            </div>
            <Button
              asChild
              className="h-11 rounded-full bg-primary px-5 text-[0.78rem] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/contact">Book a call</Link>
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
