export function normalizeInsightTag(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function collectDistinctInsightTags(items: Array<{ tags: string[] }>) {
  const tagsByKey = new Map<string, string>();

  for (const item of items) {
    for (const tag of item.tags) {
      const trimmedTag = tag.trim();
      const normalizedTag = normalizeInsightTag(trimmedTag);

      if (!trimmedTag || !normalizedTag || tagsByKey.has(normalizedTag)) {
        continue;
      }

      tagsByKey.set(normalizedTag, trimmedTag);
    }
  }

  return Array.from(tagsByKey.values()).sort((left, right) =>
    left.localeCompare(right, "en", { sensitivity: "base" }),
  );
}

export function matchesSelectedInsightTag(
  entry: { tags: readonly string[] },
  selectedTag: string | null,
) {
  if (!selectedTag) {
    return true;
  }

  const normalizedSelectedTag = normalizeInsightTag(selectedTag);

  return entry.tags.some(
    (tag) => normalizeInsightTag(tag) === normalizedSelectedTag,
  );
}
