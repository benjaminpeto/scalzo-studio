import type { AdminOverviewRangePreset } from "@/interfaces/admin/overview-dashboard";

export const adminOverviewRangeOptions: {
  label: string;
  value: AdminOverviewRangePreset;
}[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "Custom", value: "custom" },
];

export const adminOverviewTableRowLimit = 5;

export const qualifiedLeadStatuses = new Set(["qualified", "won", "lost"]);
