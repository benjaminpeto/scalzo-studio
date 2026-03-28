import Link from "next/link";

import type { TestimonialEditorOverviewProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

export function TestimonialEditorOverview({
  mode,
  testimonial,
}: TestimonialEditorOverviewProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
      <div className="rounded-[1.65rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.15),rgba(255,255,255,0.96)_42%,rgba(241,239,234,0.9))] p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {mode === "create" ? "New testimonial" : "Testimonial editor"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-foreground md:text-4xl">
          {mode === "create"
            ? "Create a new testimonial entry."
            : (testimonial?.name ?? "Edit testimonial content.")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Manage the public quote, author details, avatar, and visibility flags
          that support the homepage and about-page proof sections.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/testimonials">Back to testimonials</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Status
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {testimonial
              ? testimonial.published
                ? "Published"
                : "Draft"
              : "Draft by default"}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Featured
          </p>
          <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
            {testimonial
              ? testimonial.featured
                ? "Featured"
                : "Standard"
              : "Optional on save"}
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-surface-container-lowest/82 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Last updated
          </p>
          <p className="mt-3 text-sm font-semibold text-foreground">
            {testimonial
              ? formatUpdatedAt(testimonial.updatedAt)
              : "Will be set on save"}
          </p>
        </article>
      </div>
    </section>
  );
}
