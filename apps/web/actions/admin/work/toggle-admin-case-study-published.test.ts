// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildWorkReturnPathMock,
  eqMock,
  fromMock,
  redirectMock,
  requireAdminAccessMock,
  revalidateWorkRoutesMock,
  updateMock,
} = vi.hoisted(() => ({
  buildWorkReturnPathMock: vi.fn(
    ({
      industry,
      publishedFilter,
      status,
    }: {
      industry?: string;
      publishedFilter?: string;
      status?: string;
    }) => {
      const searchParams = new URLSearchParams();

      if (industry) {
        searchParams.set("industry", industry);
      }

      if (publishedFilter && publishedFilter !== "all") {
        searchParams.set("published", publishedFilter);
      }

      if (status) {
        searchParams.set("status", status);
      }

      return `/admin/work?${searchParams.toString()}`;
    },
  ),
  eqMock: vi.fn(),
  fromMock: vi.fn(),
  redirectMock: vi.fn((location: string) => {
    throw new Error(`REDIRECT:${location}`);
  }),
  requireAdminAccessMock: vi.fn(),
  revalidateWorkRoutesMock: vi.fn(),
  updateMock: vi.fn(),
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

vi.mock("./helpers", async () => {
  return {
    buildWorkReturnPath: buildWorkReturnPathMock,
    revalidateWorkRoutes: revalidateWorkRoutesMock,
  };
});

import { toggleAdminCaseStudyPublished } from "./toggle-admin-case-study-published";

describe("toggleAdminCaseStudyPublished", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({ update: updateMock });
    updateMock.mockReturnValue({ eq: eqMock });
    eqMock.mockResolvedValue({ error: null });
  });

  it("redirects invalid payloads back with an invalid-action status", async () => {
    await expect(toggleAdminCaseStudyPublished(new FormData())).rejects.toThrow(
      "REDIRECT:/admin/work?status=invalid-action",
    );
  });

  it("updates publish state and preserves filters in the redirect", async () => {
    const formData = new FormData();
    formData.set("caseStudyId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("currentPublished", "false");
    formData.set("industryFilter", "Hospitality");
    formData.set("publishedFilter", "draft");
    formData.set("slug", "coastal-launch");

    await expect(toggleAdminCaseStudyPublished(formData)).rejects.toThrow(
      "REDIRECT:/admin/work?industry=Hospitality&published=draft&status=publish-updated",
    );

    expect(updateMock).toHaveBeenCalledWith({
      published: true,
      published_at: expect.any(String),
    });
    expect(revalidateWorkRoutesMock).toHaveBeenCalledWith("coastal-launch");
  });
});
