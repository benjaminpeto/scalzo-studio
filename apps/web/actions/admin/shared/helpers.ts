import type { ZodError } from "zod";

import { splitLineSeparatedEntries } from "@/lib/text/lines";
import type { AdminEditorState } from "@/interfaces/admin/shared";

export function createEditorActionStateBuilders<
  TFieldErrors extends object,
  TState extends AdminEditorState<TFieldErrors>,
>() {
  return {
    createActionErrorState(
      message: string,
      fieldErrors: TFieldErrors = {} as TFieldErrors,
    ): TState {
      return {
        fieldErrors,
        message,
        redirectTo: null,
        status: "error",
      } as TState;
    },

    createActionSuccessState(input: {
      message: string;
      redirectTo: string;
    }): TState {
      return {
        fieldErrors: {} as TFieldErrors,
        message: input.message,
        redirectTo: input.redirectTo,
        status: "success",
      } as TState;
    },
  };
}

export function buildAdminReturnPath(input: {
  basePath: string;
  params: Array<{
    key: string;
    value?: string | null;
    valueToSkip?: string;
  }>;
}) {
  const searchParams = new URLSearchParams();

  for (const param of input.params) {
    if (!param.value || param.value === param.valueToSkip) {
      continue;
    }

    searchParams.set(param.key, param.value);
  }

  const queryString = searchParams.toString();

  return queryString ? `${input.basePath}?${queryString}` : input.basePath;
}

export function normalizeStringEntry(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export function buildZodFieldErrors<
  TFieldErrors extends object,
  TInput,
>(input: {
  error: ZodError<TInput>;
  fieldAliases?: Partial<Record<string, keyof TFieldErrors>>;
  ignoredFields?: string[];
}): TFieldErrors {
  const fieldErrors = {} as TFieldErrors;
  const ignoredFields = new Set(input.ignoredFields ?? []);

  for (const issue of input.error.issues) {
    const rawField = issue.path[0];

    if (typeof rawField !== "string" || ignoredFields.has(rawField)) {
      continue;
    }

    const targetField = (input.fieldAliases?.[rawField] ??
      rawField) as keyof TFieldErrors;

    if (!fieldErrors[targetField]) {
      fieldErrors[targetField] =
        issue.message as TFieldErrors[keyof TFieldErrors];
    }
  }

  return fieldErrors;
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
