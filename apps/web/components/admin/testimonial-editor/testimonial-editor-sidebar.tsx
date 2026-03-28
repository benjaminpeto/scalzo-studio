import Link from "next/link";

import type { TestimonialEditorSidebarProps } from "@/interfaces/admin/component-props";
import { Button } from "@ui/components/ui/button";

import { AdminSubmitButton } from "../shared/admin-submit-button";

export function TestimonialEditorSidebar({
  currentPath,
  mode,
  testimonial,
}: TestimonialEditorSidebarProps) {
  return (
    <aside className="space-y-4">
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Visibility
        </p>
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-[1.2rem] border border-border/70 bg-surface-container-lowest/88 px-4 py-4">
            <input
              type="checkbox"
              name="published"
              value="true"
              defaultChecked={testimonial?.published ?? false}
              className="mt-1 size-4 rounded border-border/70 text-foreground accent-[#111311]"
            />
            <span className="space-y-1">
              <span className="block text-sm font-semibold text-foreground">
                Publish on the marketing site
              </span>
              <span className="block text-sm leading-6 text-muted-foreground">
                Published testimonials can appear on the homepage and about page
                once the save completes and the routes revalidate.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-[1.2rem] border border-border/70 bg-surface-container-lowest/88 px-4 py-4">
            <input
              type="checkbox"
              name="featured"
              value="true"
              defaultChecked={testimonial?.featured ?? false}
              className="mt-1 size-4 rounded border-border/70 text-foreground accent-[#111311]"
            />
            <span className="space-y-1">
              <span className="block text-sm font-semibold text-foreground">
                Mark as featured
              </span>
              <span className="block text-sm leading-6 text-muted-foreground">
                Featured testimonials rise to the top of the public proof stack
                before recency ordering applies.
              </span>
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Operational notes
        </p>
        <dl className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          <div>
            <dt className="font-semibold text-foreground">Admin route</dt>
            <dd className="break-all">{currentPath}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Public surfaces</dt>
            <dd>Homepage proof section and about-page credibility section</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Avatar bucket</dt>
            <dd>
              {testimonial ? "testimonial-avatars" : "Assigned after create"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Save
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Saving revalidates the public proof sections and the admin
          testimonials routes.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <AdminSubmitButton createLabel="Create testimonial" mode={mode} />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/testimonials">Cancel</Link>
          </Button>
        </div>
      </section>
    </aside>
  );
}
