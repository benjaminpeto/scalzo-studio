"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  AdminCaseStudyMetricRow,
  MetricRowState,
} from "@/interfaces/admin/work-editor";

function createMetricRowState(
  row?: Partial<AdminCaseStudyMetricRow>,
  index = 0,
): MetricRowState {
  return {
    id: `metric-${index}-${row?.label ?? "new"}`,
    label: row?.label ?? "",
    value: row?.value ?? "",
  };
}

export function useAdminMetricRows(input: {
  caseStudyId?: string;
  metrics?: AdminCaseStudyMetricRow[];
}) {
  const metricsSignature = useMemo(
    () => JSON.stringify(input.metrics ?? []),
    [input.metrics],
  );
  const metrics = useMemo(
    () => JSON.parse(metricsSignature) as AdminCaseStudyMetricRow[],
    [metricsSignature],
  );
  const [metricRows, setMetricRows] = useState<MetricRowState[]>(() =>
    metrics.length
      ? metrics.map((row, index) => createMetricRowState(row, index))
      : [createMetricRowState({}, 0)],
  );

  useEffect(() => {
    setMetricRows(
      metrics.length
        ? metrics.map((row, index) => createMetricRowState(row, index))
        : [createMetricRowState({}, 0)],
    );
  }, [input.caseStudyId, metrics]);

  return {
    addMetricRow() {
      setMetricRows((currentRows) => [
        ...currentRows,
        createMetricRowState({}, currentRows.length),
      ]);
    },
    metricRows,
    removeMetricRow(id: string) {
      setMetricRows((currentRows) => {
        const nextRows = currentRows.filter((row) => row.id !== id);

        return nextRows.length ? nextRows : [createMetricRowState({}, 0)];
      });
    },
    updateMetricRow(id: string, field: "label" | "value", value: string) {
      setMetricRows((currentRows) =>
        currentRows.map((row) =>
          row.id === id
            ? {
                ...row,
                [field]: value,
              }
            : row,
        ),
      );
    },
  };
}
