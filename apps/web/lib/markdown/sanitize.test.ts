import { describe, expect, it } from "vitest";

import { sanitizeMarkdownUrls } from "./sanitize";

describe("sanitizeMarkdownUrls", () => {
  describe("dangerous link protocols", () => {
    it("strips javascript: href", () => {
      expect(sanitizeMarkdownUrls("[click](javascript:alert(1))")).toBe(
        "[click]()",
      );
    });

    it("strips javascript: href case-insensitively", () => {
      expect(sanitizeMarkdownUrls("[click](JAVASCRIPT:alert(1))")).toBe(
        "[click]()",
      );
    });

    it("strips vbscript: href", () => {
      expect(sanitizeMarkdownUrls("[click](vbscript:msgbox(1))")).toBe(
        "[click]()",
      );
    });

    it("strips data: href", () => {
      expect(
        sanitizeMarkdownUrls(
          "[click](data:text/html,<script>alert(1)</script>)",
        ),
      ).toBe("[click]()");
    });

    it("strips percent-encoded javascript: href", () => {
      expect(
        sanitizeMarkdownUrls(
          "[click](%6a%61%76%61%73%63%72%69%70%74%3aalert(1))",
        ),
      ).toBe("[click]()");
    });

    it("strips javascript: mixed-case variant", () => {
      expect(sanitizeMarkdownUrls("[click](JavaScript:alert(1))")).toBe(
        "[click]()",
      );
    });
  });

  describe("dangerous image protocols", () => {
    it("strips data: image src", () => {
      expect(sanitizeMarkdownUrls("![img](data:image/png;base64,abc123)")).toBe(
        "![img]()",
      );
    });

    it("strips javascript: image src", () => {
      expect(sanitizeMarkdownUrls("![img](javascript:void(0))")).toBe(
        "![img]()",
      );
    });
  });

  describe("safe URLs are preserved", () => {
    it("preserves https: links", () => {
      const input = "[visit](https://example.com)";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });

    it("preserves http: links", () => {
      const input = "[visit](http://example.com)";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });

    it("preserves relative paths", () => {
      const input = "[about](/about)";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });

    it("preserves anchor links", () => {
      const input = "[top](#top)";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });

    it("preserves mailto: links", () => {
      const input = "[email](mailto:hello@example.com)";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });

    it("preserves safe image URLs", () => {
      const input = "![photo](https://cdn.example.com/photo.jpg)";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });
  });

  describe("title attributes are preserved", () => {
    it("preserves title on safe links", () => {
      const input = `[visit](https://example.com "Example")`;
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });

    it("strips href and title on dangerous links", () => {
      const result = sanitizeMarkdownUrls(
        `[click](javascript:void(0) "bad link")`,
      );
      expect(result).toBe(`[click]()`);
    });
  });

  describe("does not modify non-link content", () => {
    it("leaves plain text untouched", () => {
      const input = "Hello world";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });

    it("leaves code blocks untouched", () => {
      const input = "```\njavascript:alert(1)\n```";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });

    it("leaves heading text untouched", () => {
      const input = "## javascript: not a link";
      expect(sanitizeMarkdownUrls(input)).toBe(input);
    });
  });
});
