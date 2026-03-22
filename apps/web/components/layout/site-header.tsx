"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import { navigationLinks, primaryCta } from "@/components/home/content";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@ui/components/ui/sheet";
import { Button } from "@ui/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

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
          className="hidden items-center gap-10 xl:gap-16 lg:flex"
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

        <div className="hidden lg:block">
          <Button
            asChild
            className="h-11 rounded-full bg-primary px-5 text-[0.78rem] uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
          >
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center text-foreground lg:hidden"
            >
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="section-shell paper-panel surface-grain inset-x-3 top-3 rounded-[1.75rem] border p-4 pt-14 sm:inset-x-4"
          >
            <div className="sr-only">
              <SheetTitle>Mobile navigation</SheetTitle>
              <SheetDescription>
                Primary site navigation and the main call to action.
              </SheetDescription>
            </div>
            <nav aria-label="Mobile" className="flex flex-col gap-2">
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
                <Link href={primaryCta.href} onClick={() => setOpen(false)}>
                  {primaryCta.label}
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
