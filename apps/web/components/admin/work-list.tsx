import Link from "next/link";

import { toggleAdminCaseStudyPublished } from "@/actions/admin/work/toggle-admin-case-study-published";
import type { AdminWorkListProps } from "@/interfaces/admin/work-component-props";
import { formatUpdatedAt } from "@/lib/admin/format";
import { Button } from "@ui/components/ui/button";

import { AdminListToolbar } from "./shared/admin-list-toolbar";

const statusMessageByCode = {
  "invalid-action":
    "The admin action payload was invalid. Refresh the page and try again.",
  "publish-updated": "The case study publish state was updated.",
  "update-error": "The change could not be saved right now. Try again.",
} as const;

export function AdminWorkList({ data, status }: AdminWorkListProps) {
  const statusMessage =
    status && status in statusMessageByCode
      ? statusMessageByCode[status as keyof typeof statusMessageByCode]
      : null;

  const isFiltered =
    data.selectedPublishedFilter !== "all" || !!data.selectedIndustry;

  const summaryText = `${data.totalCount} case stud${data.totalCount === 1 ? "y" : "ies"} · ${data.publishedCount} published · ${data.draftCount} draft${data.draftCount === 1 ? "" : "s"}${isFiltered ? ` · ${data.filteredCount} in filter` : ""}`;

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-surface-container-lowest/82">
      <AdminListToolbar
        title="Case studies"
        formAction="/admin/work"
        isFiltered={isFiltered}
        clearHref="/admin/work"
        newHref="/admin/work/new"
        newLabel="New case study"
        summaryText={summaryText}
        statusMessage={statusMessage}
        filters={[
          {
            name: "published",
            defaultValue: data.selectedPublishedFilter,
            placeholder: "All case studies",
            options: [
              { value: "published", label: "Published only" },
              { value: "draft", label: "Drafts only" },
            ],
          },
          {
            name: "industry",
            defaultValue: data.selectedIndustry,
            placeholder: "All industries",
            options: data.industries.map((i) => ({ value: i, label: i })),
          },
        ]}
      />

      {data.caseStudies.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Industry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Status
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
              {data.caseStudies.map((caseStudy) => (
                <tr
                  key={caseStudy.id}
                  className="transition-colors hover:bg-white/40"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/work/${caseStudy.slug}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {caseStudy.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      /work/{caseStudy.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {caseStudy.clientName || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {caseStudy.industry || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        caseStudy.published
                          ? "inline-flex rounded-full bg-[#111311] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white"
                          : "inline-flex rounded-full border border-border/70 bg-white px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                      }
                    >
                      {caseStudy.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatUpdatedAt(caseStudy.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/api/preview/work?slug=${caseStudy.slug}`}
                          prefetch={false}
                        >
                          Preview
                        </Link>
                      </Button>
                      <form action={toggleAdminCaseStudyPublished}>
                        <input
                          type="hidden"
                          name="currentPublished"
                          value={caseStudy.published ? "true" : "false"}
                        />
                        <input
                          type="hidden"
                          name="publishedFilter"
                          value={data.selectedPublishedFilter}
                        />
                        <input
                          type="hidden"
                          name="industryFilter"
                          value={data.selectedIndustry}
                        />
                        <input
                          type="hidden"
                          name="caseStudyId"
                          value={caseStudy.id}
                        />
                        <input
                          type="hidden"
                          name="slug"
                          value={caseStudy.slug}
                        />
                        <Button
                          type="submit"
                          variant={
                            caseStudy.published ? "secondary" : "default"
                          }
                          size="sm"
                        >
                          {caseStudy.published ? "Unpublish" : "Publish"}
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
              No case studies matched the current filters.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Clear the filters or broaden the published-state selection to
              inspect the full work stack.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/admin/work">Clear filters</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/work/new">New case study</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
