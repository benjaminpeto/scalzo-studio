import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BlogPostCard } from "./blog-post-card";

describe("BlogPostCard", () => {
  it("renders the default card variant with metadata and CTA", () => {
    render(
      <BlogPostCard
        title="Why premium service brands need proof"
        metadata="March 18, 2026"
        excerpt="The first screen should reduce doubt quickly."
        image={{
          alt: "Journal artwork",
          height: 1200,
          src: "/journal.jpg",
          width: 1200,
        }}
        cta={{ href: "/journal/proof", label: "Read note" }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Why premium service brands need proof",
      }),
    ).toBeTruthy();
    expect(screen.getByText("March 18, 2026")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /Read note/i }).getAttribute("href"),
    ).toBe("/journal/proof");
  });

  it("renders the featured variant without requiring a CTA", () => {
    render(
      <BlogPostCard
        title="A featured editorial note"
        variant="featured"
        metadata="March 21, 2026"
        excerpt="A longer narrative lives comfortably in the large variant."
        image={{ alt: "", height: 1400, src: "/featured.jpg", width: 1400 }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "A featured editorial note" }),
    ).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Read note/i })).toBeNull();
  });
});
