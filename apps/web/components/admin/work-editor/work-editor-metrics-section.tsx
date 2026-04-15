import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

import type { WorkEditorMetricsSectionProps } from "@/interfaces/admin/work-component-props";
import { buildDescribedBy } from "@/lib/admin/field";

import { AdminEditorField } from "../shared/admin-editor-field";

export function WorkEditorMetricsSection({
  addMetricRow,
  errors,
  metricsId,
  metricRows,
  removeMetricRow,
  updateMetricRow,
}: WorkEditorMetricsSectionProps) {
  return (
    <section className="rounded-[1.6rem] border border-border/70 bg-surface-container-lowest/82 p-5 md:p-6">
      <AdminEditorField
        error={errors.metrics}
        hint="Add key outcome rows. Empty rows are ignored only if both fields are blank."
        htmlFor={metricsId}
        label="Outcome metrics"
        optionalLabel="Optional"
      >
        <div
          id={metricsId}
          aria-describedby={buildDescribedBy({
            error: errors.metrics,
            hint: "Add key outcome rows. Empty rows are ignored only if both fields are blank.",
            id: metricsId,
          })}
          className="space-y-3"
        >
          {metricRows.map((row, index) => (
            <div
              key={row.id}
              className="grid gap-3 rounded-[1.2rem] border border-border/70 bg-white/70 p-4 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.42fr)_auto]"
            >
              <Input
                name="metricLabel"
                value={row.label}
                onChange={(event) =>
                  updateMetricRow(row.id, "label", event.target.value)
                }
                placeholder={`Metric label ${index + 1}`}
              />
              <Input
                name="metricValue"
                value={row.value}
                onChange={(event) =>
                  updateMetricRow(row.id, "value", event.target.value)
                }
                placeholder="e.g. +34% direct enquiries"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => removeMetricRow(row.id)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addMetricRow}>
            Add metric row
          </Button>
        </div>
      </AdminEditorField>
    </section>
  );
}
