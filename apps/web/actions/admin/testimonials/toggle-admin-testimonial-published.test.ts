// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildTestimonialsReturnPathMock,
  eqMock,
  fromMock,
  redirectMock,
  requireAdminAccessMock,
  revalidateTestimonialRoutesMock,
  updateMock,
} = vi.hoisted(() => ({
  buildTestimonialsReturnPathMock: vi.fn(
    ({
      featuredFilter,
      publishedFilter,
      query,
      status,
    }: {
      featuredFilter?: string;
      publishedFilter?: string;
      query?: string;
      status?: string;
    }) => {
      const searchParams = new URLSearchParams();

      if (query) {
        searchParams.set("q", query);
      }

      if (publishedFilter && publishedFilter !== "all") {
        searchParams.set("published", publishedFilter);
      }

      if (featuredFilter && featuredFilter !== "all") {
        searchParams.set("featured", featuredFilter);
      }

      if (status) {
        searchParams.set("status", status);
      }

      return `/admin/testimonials?${searchParams.toString()}`;
    },
  ),
  eqMock: vi.fn(),
  fromMock: vi.fn(),
  redirectMock: vi.fn((location: string) => {
    throw new Error(`REDIRECT:${location}`);
  }),
  requireAdminAccessMock: vi.fn(),
  revalidateTestimonialRoutesMock: vi.fn(),
  updateMock: vi.fn(),
}));

vi.mock("@/lib/env/public", () => ({
  publicEnv: {
    siteUrl: "https://example.com",
    supabaseUrl: "https://example.supabase.co",
  },
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/actions/admin/server", () => ({
  requireCurrentAdminAccess: requireAdminAccessMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => ({
    from: fromMock,
  }),
}));

vi.mock("./helpers", async () => ({
  ...(await vi.importActual("./helpers")),
  buildTestimonialsReturnPath: buildTestimonialsReturnPathMock,
  revalidateTestimonialRoutes: revalidateTestimonialRoutesMock,
}));

import { toggleAdminTestimonialPublished } from "./toggle-admin-testimonial-published";

describe("toggleAdminTestimonialPublished", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({ update: updateMock });
    updateMock.mockReturnValue({ eq: eqMock });
    eqMock.mockResolvedValue({ error: null });
  });

  it("redirects invalid payloads back with an invalid-action status", async () => {
    await expect(
      toggleAdminTestimonialPublished(new FormData()),
    ).rejects.toThrow("REDIRECT:/admin/testimonials?status=invalid-action");
  });

  it("updates publish state and preserves filters", async () => {
    const formData = new FormData();
    formData.set("currentPublished", "false");
    formData.set("featuredFilter", "featured");
    formData.set("publishedFilter", "draft");
    formData.set("searchQuery", "marina");
    formData.set("testimonialId", "550e8400-e29b-41d4-a716-446655440000");

    await expect(toggleAdminTestimonialPublished(formData)).rejects.toThrow(
      "REDIRECT:/admin/testimonials?q=marina&published=draft&featured=featured&status=publish-updated",
    );

    expect(requireAdminAccessMock).toHaveBeenCalledWith("/admin/testimonials");
    expect(fromMock).toHaveBeenCalledWith("testimonials");
    expect(updateMock).toHaveBeenCalledWith({ published: true });
    expect(eqMock).toHaveBeenCalledWith(
      "id",
      "550e8400-e29b-41d4-a716-446655440000",
    );
    expect(revalidateTestimonialRoutesMock).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });
});
