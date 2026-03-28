import Image from "next/image";
import Link from "next/link";

import { toggleAdminTestimonialFeatured } from "@/actions/admin/testimonials/toggle-admin-testimonial-featured";
import { toggleAdminTestimonialPublished } from "@/actions/admin/testimonials/toggle-admin-testimonial-published";
import type { AdminTestimonialsListProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

const statusMessageByCode = {
  deleted: "The testimonial was deleted.",
  "featured-updated": "The testimonial feature state was updated.",
  "invalid-action":
    "The admin action payload was invalid. Refresh the page and try again.",
  "publish-updated": "The testimonial publish state was updated.",
  "testimonial-missing": "That testimonial could not be found anymore.",
  "update-error": "The change could not be saved right now. Try again.",
} as const;

export function AdminTestimonialsList({
  data,
  status,
}: AdminTestimonialsListProps) {
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;

  return (
    <div className="space-y-8">
      <section
        id="overview"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(252,205,3,0.16),rgba(255,255,255,0.96)_40%,rgba(241,239,234,0.92))] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Testimonials index
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
            Search, publish, and feature the public testimonials stack.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            This route controls which testimonials appear in the public proof
            sections and which ones rise to the top as featured proof.
          </p>
          <form
            action="/admin/testimonials"
            className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]"
          >
            <Input
              type="search"
              name="q"
              defaultValue={data.query}
              placeholder="Search by name, company, role, or quote"
              className="h-12 rounded-full border border-border/70 bg-white/82 px-5"
            />

            <select
              name="published"
              defaultValue={data.selectedPublishedFilter}
              className="input-shell h-12 rounded-full border border-border/70 bg-white/82 px-5 text-sm text-foreground"
            >
              <option value="all">All states</option>
              <option value="published">Published only</option>
              <option value="draft">Drafts only</option>
            </select>

            <select
              name="featured"
              defaultValue={data.selectedFeaturedFilter}
              className="input-shell h-12 rounded-full border border-border/70 bg-white/82 px-5 text-sm text-foreground"
            >
              <option value="all">All placements</option>
              <option value="featured">Featured only</option>
              <option value="standard">Standard only</option>
            </select>

            <div className="flex gap-3 lg:justify-end">
              <Button type="submit" className="h-12 rounded-full px-6">
                Apply
              </Button>
              {data.query ||
              data.selectedFeaturedFilter !== "all" ||
              data.selectedPublishedFilter !== "all" ? (
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full px-6"
                >
                  <Link href="/admin/testimonials">Clear</Link>
                </Button>
              ) : null}
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full px-6"
              >
                <Link href="/admin/testimonials/new">New testimonial</Link>
              </Button>
            </div>
          </form>
          {statusMessage ? (
            <div className="mt-5 rounded-[1.25rem] border border-border/70 bg-white/78 p-4 text-sm leading-6 text-foreground">
              {statusMessage}
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Total testimonials
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.totalCount}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Published
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.publishedCount}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Featured
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
              {data.featuredCount}
            </p>
          </div>
        </div>
      </section>

      <section
        id="testimonial-list"
        className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82"
      >
        <div className="flex flex-col gap-3 border-b border-border/60 px-6 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Testimonial list
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {data.query ||
              data.selectedFeaturedFilter !== "all" ||
              data.selectedPublishedFilter !== "all"
                ? `${data.filteredCount} result${data.filteredCount === 1 ? "" : "s"} in the current filter set`
                : `${data.totalCount} testimonial${data.totalCount === 1 ? "" : "s"} in the current admin stack`}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Featured testimonials rise to the top on public proof surfaces, and
            publish controls decide whether they can appear publicly at all.
          </p>
        </div>

        {data.testimonials.length ? (
          <div className="divide-y divide-border/60">
            {data.testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="grid gap-5 px-6 py-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] xl:items-center"
              >
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-start gap-4">
                    {testimonial.avatarUrl ? (
                      <div className="relative size-16 overflow-hidden rounded-full border border-border/70 bg-surface-container-highest">
                        <Image
                          src={testimonial.avatarUrl}
                          alt={`${testimonial.name} avatar`}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="flex size-16 items-center justify-center rounded-full border border-dashed border-border/70 bg-white/70 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        No image
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
                          {testimonial.name}
                        </h3>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                            testimonial.published
                              ? "bg-[#111311] text-white"
                              : "border border-border/70 bg-white text-muted-foreground"
                          }`}
                        >
                          {testimonial.published ? "Published" : "Draft"}
                        </span>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                            testimonial.featured
                              ? "bg-[#fccd03] text-[#111311]"
                              : "border border-border/70 bg-white text-muted-foreground"
                          }`}
                        >
                          {testimonial.featured ? "Featured" : "Standard"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {testimonial.role || testimonial.company
                          ? [testimonial.role, testimonial.company]
                              .filter(Boolean)
                              .join(" at ")
                          : "No role or company added yet."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/testimonials/${testimonial.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    “{testimonial.quote}”
                  </p>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <p>
                      Avatar: {testimonial.avatarUrl ? "Present" : "Missing"}
                    </p>
                    <p>
                      Last updated: {formatUpdatedAt(testimonial.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 xl:items-end">
                  <form action={toggleAdminTestimonialFeatured}>
                    <input
                      type="hidden"
                      name="currentFeatured"
                      value={testimonial.featured ? "true" : "false"}
                    />
                    <input
                      type="hidden"
                      name="featuredFilter"
                      value={data.selectedFeaturedFilter}
                    />
                    <input
                      type="hidden"
                      name="publishedFilter"
                      value={data.selectedPublishedFilter}
                    />
                    <input
                      type="hidden"
                      name="searchQuery"
                      value={data.query}
                    />
                    <input
                      type="hidden"
                      name="testimonialId"
                      value={testimonial.id}
                    />
                    <Button
                      type="submit"
                      variant={testimonial.featured ? "secondary" : "outline"}
                      size="sm"
                    >
                      {testimonial.featured ? "Remove feature" : "Feature"}
                    </Button>
                  </form>

                  <form action={toggleAdminTestimonialPublished}>
                    <input
                      type="hidden"
                      name="currentPublished"
                      value={testimonial.published ? "true" : "false"}
                    />
                    <input
                      type="hidden"
                      name="featuredFilter"
                      value={data.selectedFeaturedFilter}
                    />
                    <input
                      type="hidden"
                      name="publishedFilter"
                      value={data.selectedPublishedFilter}
                    />
                    <input
                      type="hidden"
                      name="searchQuery"
                      value={data.query}
                    />
                    <input
                      type="hidden"
                      name="testimonialId"
                      value={testimonial.id}
                    />
                    <Button
                      type="submit"
                      variant={testimonial.published ? "secondary" : "default"}
                      size="sm"
                    >
                      {testimonial.published ? "Unpublish" : "Publish"}
                    </Button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10">
            <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-card/60 p-6">
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                No testimonials matched this view.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Try clearing the filters, searching by author or company, or add
                a new testimonial to seed the proof stack.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {data.query ||
                data.selectedFeaturedFilter !== "all" ||
                data.selectedPublishedFilter !== "all" ? (
                  <Button asChild variant="outline">
                    <Link href="/admin/testimonials">Clear filters</Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline">
                  <Link href="/admin/testimonials/new">
                    Create the first testimonial
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
