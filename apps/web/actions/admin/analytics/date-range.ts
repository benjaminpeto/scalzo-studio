import type {
  AdminOverviewDateRange,
  AdminOverviewRangePreset,
  AdminOverviewSearchParams,
} from "@/interfaces/admin/overview-dashboard";

export interface TimeWindow {
  endExclusive: Date;
  startInclusive: Date;
}

export interface ResolvedAdminOverviewRange extends AdminOverviewDateRange {
  currentWindow: TimeWindow;
  previousWindow: TimeWindow;
}

const rangeDayCountMap: Record<
  Exclude<AdminOverviewRangePreset, "custom">,
  number
> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

function toUtcDateString(value: Date) {
  return value.toISOString().slice(0, 10);
}

function startOfUtcDay(value: Date) {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()),
  );
}

function addUtcDays(value: Date, days: number) {
  return new Date(value.getTime() + days * 24 * 60 * 60 * 1000);
}

function parseDateInput(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
}

function formatRangeLabel(input: {
  from: string;
  key: AdminOverviewRangePreset;
  to: string;
}) {
  if (input.key !== "custom") {
    return `Last ${rangeDayCountMap[input.key]} days`;
  }

  return `${input.from} to ${input.to}`;
}

function buildRangeOutput(input: {
  currentEndExclusive: Date;
  currentStartInclusive: Date;
  key: AdminOverviewRangePreset;
  previousEndExclusive: Date;
  previousStartInclusive: Date;
}): ResolvedAdminOverviewRange {
  const from = toUtcDateString(input.currentStartInclusive);
  const to = toUtcDateString(addUtcDays(input.currentEndExclusive, -1));
  const previousFrom = toUtcDateString(input.previousStartInclusive);
  const previousTo = toUtcDateString(
    addUtcDays(input.previousEndExclusive, -1),
  );

  return {
    currentWindow: {
      endExclusive: input.currentEndExclusive,
      startInclusive: input.currentStartInclusive,
    },
    from,
    key: input.key,
    label: formatRangeLabel({ from, key: input.key, to }),
    previousFrom,
    previousTo,
    previousWindow: {
      endExclusive: input.previousEndExclusive,
      startInclusive: input.previousStartInclusive,
    },
    to,
  };
}

export function resolveAdminOverviewRange(
  input?: AdminOverviewSearchParams,
  now = new Date(),
): ResolvedAdminOverviewRange {
  const today = startOfUtcDay(now);
  const tomorrow = addUtcDays(today, 1);
  const requestedRange = input?.range;
  const presetRange: AdminOverviewRangePreset =
    requestedRange === "7d" ||
    requestedRange === "30d" ||
    requestedRange === "90d" ||
    requestedRange === "custom"
      ? requestedRange
      : "30d";

  if (presetRange === "custom") {
    const from = parseDateInput(input?.from);
    const to = parseDateInput(input?.to);

    if (from && to && from <= to) {
      const currentEndExclusive = addUtcDays(to, 1);
      const rangeLengthInDays = Math.round(
        (currentEndExclusive.getTime() - from.getTime()) /
          (24 * 60 * 60 * 1000),
      );
      const previousEndExclusive = from;
      const previousStartInclusive = addUtcDays(from, -rangeLengthInDays);

      return buildRangeOutput({
        currentEndExclusive,
        currentStartInclusive: from,
        key: "custom",
        previousEndExclusive,
        previousStartInclusive,
      });
    }
  }

  const rangeLengthInDays =
    rangeDayCountMap[
      presetRange as Exclude<AdminOverviewRangePreset, "custom">
    ];
  const currentStartInclusive = addUtcDays(today, -(rangeLengthInDays - 1));
  const previousEndExclusive = currentStartInclusive;
  const previousStartInclusive = addUtcDays(
    previousEndExclusive,
    -rangeLengthInDays,
  );

  return buildRangeOutput({
    currentEndExclusive: tomorrow,
    currentStartInclusive,
    key: presetRange as Exclude<AdminOverviewRangePreset, "custom">,
    previousEndExclusive,
    previousStartInclusive,
  });
}
