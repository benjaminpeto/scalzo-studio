"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { navigationLinks } from "@/components/home/content";
import { MotionPanel, useLockBodyScroll } from "@/components/home/motion";
import { Button } from "@ui/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useLockBodyScroll(open);

  return (
    <header className="sticky top-0 z-50 bg-[rgba(250,249,245,0.92)] backdrop-blur-xl">
      <div className="section-shell flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          className="min-w-0 font-display text-[1.9rem] leading-none tracking-[-0.06em] text-foreground"
          aria-label="Scalzo Studio home"
        >
          scalzo
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-16 lg:flex"
        >
          {navigationLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden w-10 lg:block" />

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center text-foreground lg:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <MotionPanel isOpen={open} className="section-shell pb-6 lg:hidden">
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="paper-panel surface-grain flex flex-col gap-2 rounded-[1.75rem] p-4"
        >
          {navigationLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl px-4 py-3 text-lg text-foreground transition-colors hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            className="mt-3 h-12 rounded-full bg-primary px-6 text-[0.78rem] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
          >
            <Link href="#contact" onClick={() => setOpen(false)}>
              Start a project
            </Link>
          </Button>
        </nav>
      </MotionPanel>
    </header>
  );
}
