// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildRedirectsReturnPathMock,
  deleteEqMock,
  deleteMock,
  fromMock,
  maybeSingleMock,
  redirectMock,
  requireAdminAccessMock,
  revalidateRedirectRoutesMock,
  selectEqMock,
  selectMock,
} = vi.hoisted(() => ({
  buildRedirectsReturnPathMock: vi.fn(
    ({ status }: { status?: string }) =>
      `/admin/redirects${status ? `?status=${status}` : ""}`,
  ),
  deleteEqMock: vi.fn(),
  deleteMock: vi.fn(),
  fromMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  redirectMock: vi.fn((location: string) => {
    throw new Error(`REDIRECT:${location}`);
  }),
  requireAdminAccessMock: vi.fn(),
  revalidateRedirectRoutesMock: vi.fn(),
  selectEqMock: vi.fn(),
  selectMock: vi.fn(),
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
  buildRedirectsReturnPath: buildRedirectsReturnPathMock,
  revalidateRedirectRoutes: revalidateRedirectRoutesMock,
}));

import { deleteAdminRedirect } from "./delete-admin-redirect";

describe("deleteAdminRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({
      delete: deleteMock,
      select: selectMock,
    });
    selectMock.mockReturnValue({ eq: selectEqMock });
    selectEqMock.mockReturnValue({ maybeSingle: maybeSingleMock });
    maybeSingleMock.mockResolvedValue({
      data: {
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
      error: null,
    });
    deleteMock.mockReturnValue({ eq: deleteEqMock });
    deleteEqMock.mockResolvedValue({ error: null });
  });

  it("redirects invalid payloads back with invalid-action", async () => {
    await expect(deleteAdminRedirect(new FormData())).rejects.toThrow(
      "REDIRECT:/admin/redirects?status=invalid-action",
    );
  });

  it("deletes the redirect and redirects with deleted status", async () => {
    const formData = new FormData();
    formData.set("confirmDelete", "true");
    formData.set("redirectId", "550e8400-e29b-41d4-a716-446655440000");

    await expect(deleteAdminRedirect(formData)).rejects.toThrow(
      "REDIRECT:/admin/redirects?status=deleted",
    );

    expect(requireAdminAccessMock).toHaveBeenCalledWith(
      "/admin/redirects/550e8400-e29b-41d4-a716-446655440000",
    );
    expect(fromMock).toHaveBeenCalledWith("redirects");
    expect(deleteEqMock).toHaveBeenCalledWith(
      "id",
      "550e8400-e29b-41d4-a716-446655440000",
    );
    expect(revalidateRedirectRoutesMock).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });
});
