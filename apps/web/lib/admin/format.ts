interface FormatAdminDateOptions {
  emptyLabel?: string;
}

export function formatUpdatedAt(
  value: string | null,
  options?: FormatAdminDateOptions,
) {
  const emptyLabel = options?.emptyLabel ?? "Unknown";

  if (!value) {
    return emptyLabel;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return emptyLabel;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}
