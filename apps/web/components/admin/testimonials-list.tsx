import Link from "next/link";

import { toggleAdminTestimonialFeatured } from "@/actions/admin/testimonials/toggle-admin-testimonial-featured";
import { toggleAdminTestimonialPublished } from "@/actions/admin/testimonials/toggle-admin-testimonial-published";
import type { AdminTestimonialsListProps } from "@/interfaces/admin/component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

import { AdminListToolbar } from "./shared/admin-list-toolbar";

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

  const isFiltered =
    !!data.query ||
    data.selectedFeaturedFilter !== "all" ||
    data.selectedPublishedFilter !== "all";

  const summaryText = `${data.totalCount} testimonial${data.totalCount === 1 ? "" : "s"} · ${data.publishedCount} published · ${data.featuredCount} featured${isFiltered ? ` · ${data.filteredCount} in filter` : ""}`;

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82">
      <AdminListToolbar
        title="Testimonials"
        formAction="/admin/testimonials"
        query={data.query}
        searchPlaceholder="Search by name, company, role, or quote"
        isFiltered={isFiltered}
        clearHref="/admin/testimonials"
        newHref="/admin/testimonials/new"
        newLabel="New testimonial"
        summaryText={summaryText}
        statusMessage={statusMessage}
        filters={[
          {
            name: "published",
            defaultValue: data.selectedPublishedFilter,
            placeholder: "All states",
            options: [
              { value: "published", label: "Published only" },
              { value: "draft", label: "Drafts only" },
            ],
          },
          {
            name: "featured",
            defaultValue: data.selectedFeaturedFilter,
            placeholder: "All placements",
            options: [
              { value: "featured", label: "Featured only" },
              { value: "standard", label: "Standard only" },
            ],
          },
        ]}
      />

      {data.testimonials.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Role &amp; Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Featured
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Updated
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.testimonials.map((testimonial) => (
                <tr
                  key={testimonial.id}
                  className="transition-colors hover:bg-white/40"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/testimonials/${testimonial.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {testimonial.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {testimonial.role || testimonial.company
                      ? [testimonial.role, testimonial.company]
                          .filter(Boolean)
                          .join(" at ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        testimonial.published
                          ? "inline-flex rounded-full bg-[#111311] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white"
                          : "inline-flex rounded-full border border-border/70 bg-white px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                      }
                    >
                      {testimonial.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        testimonial.featured
                          ? "inline-flex rounded-full bg-[#fccd03] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#111311]"
                          : "inline-flex rounded-full border border-border/70 bg-white px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                      }
                    >
                      {testimonial.featured ? "Featured" : "Standard"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatUpdatedAt(testimonial.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
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
                          variant={
                            testimonial.featured ? "secondary" : "outline"
                          }
                          size="sm"
                        >
                          {testimonial.featured ? "Unfeature" : "Feature"}
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
                          variant={
                            testimonial.published ? "secondary" : "default"
                          }
                          size="sm"
                        >
                          {testimonial.published ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-10">
          <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-card/60 p-6">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              No testimonials matched this view.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Try clearing the filters, searching by author or company, or add a
              new testimonial to seed the proof stack.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {isFiltered ? (
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
    </div>
  );
}
