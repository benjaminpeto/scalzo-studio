// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildServicesReturnPathMock,
  eqMock,
  fromMock,
  redirectMock,
  requireAdminAccessMock,
  revalidateServiceRoutesMock,
  updateMock,
} = vi.hoisted(() => ({
  buildServicesReturnPathMock: vi.fn(
    ({ query, status }: { query?: string; status?: string }) => {
      const searchParams = new URLSearchParams();

      if (query) {
        searchParams.set("q", query);
      }

      if (status) {
        searchParams.set("status", status);
      }

      return `/admin/services?${searchParams.toString()}`;
    },
  ),
  eqMock: vi.fn(),
  fromMock: vi.fn(),
  redirectMock: vi.fn((location: string) => {
    throw new Error(`REDIRECT:${location}`);
  }),
  requireAdminAccessMock: vi.fn(),
  revalidateServiceRoutesMock: vi.fn(),
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
    buildServicesReturnPath: buildServicesReturnPathMock,
    revalidateServiceRoutes: revalidateServiceRoutesMock,
  };
});

import { toggleAdminServicePublished } from "./toggle-admin-service-published";

describe("toggleAdminServicePublished", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({ update: updateMock });
    updateMock.mockReturnValue({ eq: eqMock });
    eqMock.mockResolvedValue({ error: null });
  });

  it("redirects invalid payloads back with an invalid-action status", async () => {
    await expect(toggleAdminServicePublished(new FormData())).rejects.toThrow(
      "REDIRECT:/admin/services?status=invalid-action",
    );
  });

  it("updates publish state and redirects to the filtered list", async () => {
    const formData = new FormData();
    formData.set("currentPublished", "false");
    formData.set("searchQuery", "strategy");
    formData.set("serviceId", "550e8400-e29b-41d4-a716-446655440000");
    formData.set("slug", "conversion-strategy");

    await expect(toggleAdminServicePublished(formData)).rejects.toThrow(
      "REDIRECT:/admin/services?q=strategy&status=publish-updated",
    );

    expect(requireAdminAccessMock).toHaveBeenCalledWith("/admin/services");
    expect(fromMock).toHaveBeenCalledWith("services");
    expect(updateMock).toHaveBeenCalledWith({ published: true });
    expect(eqMock).toHaveBeenCalledWith(
      "id",
      "550e8400-e29b-41d4-a716-446655440000",
    );
    expect(revalidateServiceRoutesMock).toHaveBeenCalledWith(
      "conversion-strategy",
    );
  });
});
