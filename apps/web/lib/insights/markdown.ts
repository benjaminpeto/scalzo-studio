export interface InsightHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

export function buildInsightHeadingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdownFormatting(value: string) {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[`*_~>#-]/g, "")
    .trim();
}

export function extractInsightHeadings(content: string): InsightHeading[] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^(##|###)\s+/.test(line))
    .map((line) => {
      const [, hashes = "", rawText = ""] =
        line.match(/^(##|###)\s+(.+)$/) ?? [];
      const text = stripMarkdownFormatting(rawText);

      return {
        id: buildInsightHeadingId(text),
        level: hashes.length as 2 | 3,
        text,
      };
    })
    .filter((heading) => Boolean(heading.id) && Boolean(heading.text));
}

export function extractInsightImageUrls(content: string) {
  return Array.from(
    new Set(
      [...content.matchAll(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)]
        .map((match) => match[1]?.trim())
        .filter(Boolean) as string[],
    ),
  );
}
