import Link from "next/link";

import type { RedirectEditorSidebarProps } from "@/interfaces/admin/component-props";
import { Button } from "@ui/components/ui/button";

import { AdminSubmitButton } from "../shared/admin-submit-button";

export function RedirectEditorSidebar({
  currentPath,
  mode,
  redirectRecord,
}: RedirectEditorSidebarProps) {
  return (
    <aside className="space-y-4">
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
            <dt className="font-semibold text-foreground">Runtime status</dt>
            <dd>
              Public requests now honor these redirects in proxy. Source hash
              fragments are not matchable at request time, but destination
              hashes are preserved.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Current source</dt>
            <dd className="break-all">
              {redirectRecord ? redirectRecord.fromPath : "Assigned on save"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Save
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Saving revalidates the admin redirects routes. Updated rules apply to
          subsequent public requests without a new build step.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <AdminSubmitButton createLabel="Create redirect" mode={mode} />
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/redirects">Cancel</Link>
          </Button>
        </div>
      </section>
    </aside>
  );
}
