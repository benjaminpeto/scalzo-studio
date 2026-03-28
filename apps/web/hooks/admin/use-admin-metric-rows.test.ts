import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAdminMetricRows } from "./use-admin-metric-rows";

describe("useAdminMetricRows", () => {
  it("adds, updates, and preserves a fallback row when removals empty the list", () => {
    const { result } = renderHook(() =>
      useAdminMetricRows({
        metrics: [{ label: "Leads", value: "+20%" }],
      }),
    );

    expect(result.current.metricRows).toHaveLength(1);

    act(() => {
      result.current.addMetricRow();
    });

    expect(result.current.metricRows).toHaveLength(2);

    const editableRowId = result.current.metricRows[1]?.id ?? "";

    act(() => {
      result.current.updateMetricRow(editableRowId, "label", "Bookings");
      result.current.updateMetricRow(editableRowId, "value", "+12%");
    });

    expect(result.current.metricRows[1]).toMatchObject({
      label: "Bookings",
      value: "+12%",
    });

    act(() => {
      for (const row of result.current.metricRows) {
        result.current.removeMetricRow(row.id);
      }
    });

    expect(result.current.metricRows).toHaveLength(1);
    expect(result.current.metricRows[0]).toMatchObject({
      label: "",
      value: "",
    });
  });
});
