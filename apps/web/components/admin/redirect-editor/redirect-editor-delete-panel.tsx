"use client";

import { useState } from "react";

import type { RedirectEditorDeletePanelProps } from "@/interfaces/admin/component-props";
import { Button } from "@ui/components/ui/button";

export function RedirectEditorDeletePanel({
  action,
  redirectRecord,
}: RedirectEditorDeletePanelProps) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form action={action} className="xl:col-start-2">
      <section className="rounded-[1.6rem] border border-destructive/20 bg-destructive/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-destructive/80">
          Delete
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-foreground">
          Remove this redirect permanently.
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          This deletes the redirect record from the admin-managed set. This
          action cannot be undone.
        </p>
        <input type="hidden" name="redirectId" value={redirectRecord.id} />
        <label className="mt-4 flex items-start gap-3 rounded-[1.15rem] border border-destructive/20 bg-white/70 px-4 py-3">
          <input
            type="checkbox"
            name="confirmDelete"
            value="true"
            required
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-1 size-4 rounded border-border/70 accent-[#111311]"
          />
          <span className="text-sm leading-6 text-muted-foreground">
            I understand this permanently deletes the redirect from{" "}
            <code>{redirectRecord.fromPath}</code>.
          </span>
        </label>
        <div className="mt-5">
          <Button
            type="submit"
            variant="destructive"
            className="rounded-full"
            disabled={!confirmed}
          >
            Delete redirect
          </Button>
        </div>
      </section>
    </form>
  );
}
