// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env/public", () => ({
  publicEnv: {
    siteUrl: "https://example.com",
    supabaseUrl: "https://example.supabase.co",
  },
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import {
  buildNormalizedTestimonialPayload,
  buildTestimonialsReturnPath,
  extractManagedTestimonialAvatarObjectPathFromUrl,
  filterAdminTestimonials,
  getTestimonialSearchText,
  summarizeAdminTestimonials,
} from "./helpers";

describe("testimonials helpers", () => {
  it("builds the filtered return path", () => {
    expect(
      buildTestimonialsReturnPath({
        featuredFilter: "featured",
        publishedFilter: "draft",
        query: "marina",
        status: "publish-updated",
      }),
    ).toBe(
      "/admin/testimonials?q=marina&published=draft&featured=featured&status=publish-updated",
    );
  });

  it("derives search text, filters, and counts", () => {
    const allTestimonials = [
      {
        avatarUrl: null,
        company: "Northshore",
        featured: true,
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Marina Ortega",
        published: true,
        quote: "Clear strategy and sharp execution.",
        role: "Founder",
        searchText: getTestimonialSearchText({
          company: "Northshore",
          name: "Marina Ortega",
          quote: "Clear strategy and sharp execution.",
          role: "Founder",
        }),
        updatedAt: "2026-03-28T10:00:00.000Z",
      },
      {
        avatarUrl: null,
        company: "Tide Studio",
        featured: false,
        id: "550e8400-e29b-41d4-a716-446655440001",
        name: "Leo Hart",
        published: false,
        quote: "Fast collaboration.",
        role: "Creative Lead",
        searchText: getTestimonialSearchText({
          company: "Tide Studio",
          name: "Leo Hart",
          quote: "Fast collaboration.",
          role: "Creative Lead",
        }),
        updatedAt: "2026-03-27T10:00:00.000Z",
      },
    ];

    expect(
      filterAdminTestimonials(allTestimonials, {
        featuredFilter: "featured",
        publishedFilter: "published",
        query: "marina",
      }),
    ).toHaveLength(1);
    expect(
      summarizeAdminTestimonials(
        allTestimonials.map((testimonial) => ({
          avatarUrl: testimonial.avatarUrl,
          company: testimonial.company,
          featured: testimonial.featured,
          id: testimonial.id,
          name: testimonial.name,
          published: testimonial.published,
          quote: testimonial.quote,
          role: testimonial.role,
          updatedAt: testimonial.updatedAt,
        })),
      ),
    ).toEqual({
      featuredCount: 1,
      publishedCount: 1,
      totalCount: 2,
    });
  });

  it("extracts managed avatar object paths from Supabase URLs", () => {
    expect(
      extractManagedTestimonialAvatarObjectPathFromUrl(
        "https://example.supabase.co/storage/v1/object/public/testimonial-avatars/550e8400-e29b-41d4-a716-446655440000/avatar/client-headshot.webp",
      ),
    ).toBe("550e8400-e29b-41d4-a716-446655440000/avatar/client-headshot.webp");
    expect(
      extractManagedTestimonialAvatarObjectPathFromUrl(
        "https://cdn.example.com/image.webp",
      ),
    ).toBeNull();
  });

  it("normalizes a valid testimonial payload", () => {
    const result = buildNormalizedTestimonialPayload({
      company: "  Northshore  ",
      featured: true,
      name: "  Marina Ortega  ",
      published: true,
      quote: "  Clear strategy and sharp execution.  ",
      role: "  Founder  ",
    });

    expect(result.errorState).toBeNull();
    expect(result.payload).toMatchObject({
      company: "Northshore",
      featured: true,
      name: "Marina Ortega",
      published: true,
      quote: "Clear strategy and sharp execution.",
      role: "Founder",
    });
  });
});
