// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildInsightsReturnPathMock,
  eqMock,
  fromMock,
  redirectMock,
  requireAdminAccessMock,
  revalidateInsightRoutesMock,
  updateMock,
} = vi.hoisted(() => ({
  buildInsightsReturnPathMock: vi.fn(
    ({
      publishedFilter,
      status,
      tag,
    }: {
      publishedFilter?: string;
      status?: string;
      tag?: string;
    }) => {
      const searchParams = new URLSearchParams();

      if (publishedFilter && publishedFilter !== "all") {
        searchParams.set("published", publishedFilter);
      }

      if (status) {
        searchParams.set("status", status);
      }

      if (tag) {
        searchParams.set("tag", tag);
      }

      return `/admin/insights?${searchParams.toString()}`;
    },
  ),
  eqMock: vi.fn(),
  fromMock: vi.fn(),
  redirectMock: vi.fn((location: string) => {
    throw new Error(`REDIRECT:${location}`);
  }),
  requireAdminAccessMock: vi.fn(),
  revalidateInsightRoutesMock: vi.fn(),
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
    buildInsightsReturnPath: buildInsightsReturnPathMock,
    revalidateInsightRoutes: revalidateInsightRoutesMock,
  };
});

import { toggleAdminInsightPublished } from "./toggle-admin-insight-published";

describe("toggleAdminInsightPublished", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({ update: updateMock });
    updateMock.mockReturnValue({ eq: eqMock });
    eqMock.mockResolvedValue({ error: null });
  });

  it("redirects invalid payloads back with an invalid-action status", async () => {
    await expect(toggleAdminInsightPublished(new FormData())).rejects.toThrow(
      "REDIRECT:/admin/insights?status=invalid-action",
    );
  });

  it("updates publish state and preserves filters in the redirect", async () => {
    const formData = new FormData();
    formData.set("currentPublished", "false");
    formData.set("currentPublishedAt", "");
    formData.set("postId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("publishedFilter", "draft");
    formData.set("slug", "premium-narrative");
    formData.set("tagFilter", "Strategy");

    await expect(toggleAdminInsightPublished(formData)).rejects.toThrow(
      "REDIRECT:/admin/insights?published=draft&status=publish-updated&tag=Strategy",
    );

    expect(updateMock).toHaveBeenCalledWith({
      published: true,
      published_at: expect.any(String),
    });
    expect(revalidateInsightRoutesMock).toHaveBeenCalledWith(
      "premium-narrative",
    );
  });
});
