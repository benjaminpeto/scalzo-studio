import { splitLineSeparatedEntries } from "@/lib/text/lines";

export function normalizeStringEntry(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export function normalizeOptionalText(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function normalizeKebabSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeLineSeparatedEntries(input: {
  itemLimit: number;
  itemMaxLength: number;
  maxLengthErrorMessage?: string;
  limitErrorMessage?: string;
  value?: string;
}) {
  const items = splitLineSeparatedEntries(input.value);

  if (items.length > input.itemLimit) {
    return {
      error:
        input.limitErrorMessage ??
        `Keep this list to ${input.itemLimit} items or fewer.`,
      items: [] as string[],
    };
  }

  const tooLongItem = items.find((item) => item.length > input.itemMaxLength);

  if (tooLongItem) {
    return {
      error:
        input.maxLengthErrorMessage ??
        `Each entry must stay under ${input.itemMaxLength} characters.`,
      items: [] as string[],
    };
  }

  return {
    error: null,
    items,
  };
}

export function isFileEntry(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0 && Boolean(value.name);
}

export function buildUniqueStorageFileName(fileName: string) {
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${fileName}`;
}
