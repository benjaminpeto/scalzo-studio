const DANGEROUS_PROTOCOLS = /^[\s\u0000]*(?:javascript|vbscript|data):/i;

function isDangerousUrl(url: string): boolean {
  const decoded = url.replace(/%[0-9a-fA-F]{2}/g, (m) =>
    String.fromCharCode(parseInt(m.slice(1), 16)),
  );
  return DANGEROUS_PROTOCOLS.test(decoded.trim());
}

// Matches a CommonMark link destination: characters that aren't `(`, `)`,
// space, or `"`, with optional balanced paren groups (one level deep).
// e.g. both "https://example.com" and "javascript:alert(1)" are captured whole.
const URL_SEGMENT = /[^()\s"]*(?:\([^)]*\)[^()\s"]*)*/;

const LINK_RE = new RegExp(
  String.raw`(\[[^\]]*\])\((${URL_SEGMENT.source})((?:\s+"[^"]*")?)\)`,
  "g",
);
const IMAGE_RE = new RegExp(
  String.raw`(!\[[^\]]*\])\((${URL_SEGMENT.source})((?:\s+"[^"]*")?)\)`,
  "g",
);

/**
 * Strips dangerous URL protocols (javascript:, vbscript:, data:) from inline
 * markdown links and images before content is stored. Handles %xx-encoded
 * obfuscation (e.g. javascript%3a). Structure is preserved so react-markdown
 * continues to parse correctly; the href/src is simply blanked.
 */
export function sanitizeMarkdownUrls(content: string): string {
  const replace = (_: string, bracket: string, url: string, title: string) =>
    isDangerousUrl(url) ? `${bracket}()` : `${bracket}(${url}${title})`;

  return content.replace(LINK_RE, replace).replace(IMAGE_RE, replace);
}
