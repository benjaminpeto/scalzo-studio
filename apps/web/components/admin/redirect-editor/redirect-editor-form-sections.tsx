import { Input } from "@ui/components/ui/input";

import type { RedirectEditorFormSectionsProps } from "@/interfaces/admin/component-props";
import { buildDescribedBy } from "@/lib/admin/field";

import { AdminEditorField } from "../shared/admin-editor-field";

export function RedirectEditorFormSections({
  errors,
  fromPathId,
  redirectRecord,
  statusCodeId,
  toPathId,
}: RedirectEditorFormSectionsProps) {
  return (
    <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
      <div className="grid gap-5">
        <AdminEditorField
          error={errors.fromPath}
          hint="Existing path to match. Internal paths only."
          htmlFor={fromPathId}
          label="From path"
        >
          <Input
            id={fromPathId}
            name="fromPath"
            defaultValue={redirectRecord?.fromPath ?? ""}
            aria-describedby={buildDescribedBy({
              error: errors.fromPath,
              hint: "Existing path to match. Internal paths only.",
              id: fromPathId,
            })}
            aria-invalid={Boolean(errors.fromPath)}
            placeholder="/old-service"
            required
            spellCheck={false}
          />
        </AdminEditorField>

        <AdminEditorField
          error={errors.toPath}
          hint="Destination path to serve instead. Internal paths only."
          htmlFor={toPathId}
          label="To path"
        >
          <Input
            id={toPathId}
            name="toPath"
            defaultValue={redirectRecord?.toPath ?? ""}
            aria-describedby={buildDescribedBy({
              error: errors.toPath,
              hint: "Destination path to serve instead. Internal paths only.",
              id: toPathId,
            })}
            aria-invalid={Boolean(errors.toPath)}
            placeholder="/services/new-service"
            required
            spellCheck={false}
          />
        </AdminEditorField>

        <AdminEditorField
          error={errors.statusCode}
          hint="Use 301 for permanent moves and 302 for temporary routing."
          htmlFor={statusCodeId}
          label="Status code"
        >
          <select
            id={statusCodeId}
            name="statusCode"
            defaultValue={String(redirectRecord?.statusCode ?? 301)}
            aria-describedby={buildDescribedBy({
              error: errors.statusCode,
              hint: "Use 301 for permanent moves and 302 for temporary routing.",
              id: statusCodeId,
            })}
            aria-invalid={Boolean(errors.statusCode)}
            className="input-shell h-12 rounded-[1rem] border border-border/70 bg-white/82 px-4 text-sm text-foreground"
          >
            <option value="301">301 — Permanent redirect</option>
            <option value="302">302 — Temporary redirect</option>
          </select>
        </AdminEditorField>
      </div>
    </section>
  );
}
