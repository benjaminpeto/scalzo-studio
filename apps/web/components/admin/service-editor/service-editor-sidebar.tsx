import Link from "next/link";

import type { ServiceEditorSidebarProps } from "@/interfaces/admin/component-props";
import { Button } from "@ui/components/ui/button";

import { AdminPublishField } from "../shared/admin-publish-field";
import { AdminSubmitButton } from "../shared/admin-submit-button";

export function ServiceEditorSidebar({
  currentPath,
  mode,
  service,
}: ServiceEditorSidebarProps) {
  return (
    <aside className="space-y-4">
      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Publishing
        </p>
        <div className="mt-4">
          <AdminPublishField
            copy="Published services appear on the public services index and detail routes after save and revalidation."
            defaultChecked={service?.published ?? false}
          />
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Draft services remain editable in admin while staying hidden from the
          public site.
        </p>
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
            <dt className="font-semibold text-foreground">Order index</dt>
            <dd>
              {service
                ? String(service.orderIndex + 1).padStart(2, "0")
                : "Appended to the end on create"}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Public route</dt>
            <dd className="break-all">
              {mode === "create"
                ? "Assigned after slug validation and save"
                : `/services/${service?.slug ?? ""}`}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Save
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Saving revalidates the public services index, the service detail
          route, and the admin listing.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <AdminSubmitButton createLabel="Create service" mode={mode} />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/services">Cancel</Link>
          </Button>
        </div>
      </section>
    </aside>
  );
}
