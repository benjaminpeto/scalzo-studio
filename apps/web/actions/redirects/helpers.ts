export function normalizeInternalRedirectPath(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      error: "Enter a path.",
      value: null as string | null,
    };
  }

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return {
      error: "Enter an internal path that starts with /.",
      value: null,
    };
  }

  if (/\s/.test(trimmed)) {
    return {
      error: "Paths cannot contain spaces.",
      value: null,
    };
  }

  try {
    const normalizedUrl = new URL(trimmed, "https://scalzo.internal");
    const normalizedPathname =
      normalizedUrl.pathname === "/"
        ? "/"
        : normalizedUrl.pathname.replace(/\/+$/, "");

    return {
      error: null,
      value: `${normalizedPathname}${normalizedUrl.search}${normalizedUrl.hash}`,
    };
  } catch {
    return {
      error: "Enter a valid internal path.",
      value: null,
    };
  }
}

export function stripRedirectHash(value: string) {
  const hashIndex = value.indexOf("#");

  return hashIndex === -1 ? value : value.slice(0, hashIndex);
}

export function normalizeComparableRedirectPath(value: string) {
  const normalized = normalizeInternalRedirectPath(value);

  if (normalized.error || !normalized.value) {
    return normalized;
  }

  return {
    error: null,
    value: stripRedirectHash(normalized.value),
  };
}
