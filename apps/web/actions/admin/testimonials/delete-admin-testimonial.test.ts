// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildTestimonialsReturnPathMock,
  deleteEqMock,
  deleteManagedTestimonialAvatarObjectsMock,
  deleteMock,
  extractManagedTestimonialAvatarObjectPathFromUrlMock,
  fromMock,
  maybeSingleMock,
  redirectMock,
  requireAdminAccessMock,
  revalidateTestimonialRoutesMock,
  selectEqMock,
  selectMock,
} = vi.hoisted(() => ({
  buildTestimonialsReturnPathMock: vi.fn(
    ({ status }: { status?: string }) =>
      `/admin/testimonials${status ? `?status=${status}` : ""}`,
  ),
  deleteEqMock: vi.fn(),
  deleteManagedTestimonialAvatarObjectsMock: vi.fn(),
  deleteMock: vi.fn(),
  extractManagedTestimonialAvatarObjectPathFromUrlMock: vi.fn(),
  fromMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  redirectMock: vi.fn((location: string) => {
    throw new Error(`REDIRECT:${location}`);
  }),
  requireAdminAccessMock: vi.fn(),
  revalidateTestimonialRoutesMock: vi.fn(),
  selectEqMock: vi.fn(),
  selectMock: vi.fn(),
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

vi.mock("./storage", () => ({
  deleteManagedTestimonialAvatarObjects:
    deleteManagedTestimonialAvatarObjectsMock,
  extractManagedTestimonialAvatarObjectPathFromUrl:
    extractManagedTestimonialAvatarObjectPathFromUrlMock,
}));

import { deleteAdminTestimonial } from "./delete-admin-testimonial";

describe("deleteAdminTestimonial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteManagedTestimonialAvatarObjectsMock.mockResolvedValue(undefined);
    fromMock.mockReturnValue({
      delete: deleteMock,
      select: selectMock,
    });
    selectMock.mockReturnValue({ eq: selectEqMock });
    selectEqMock.mockReturnValue({ maybeSingle: maybeSingleMock });
    maybeSingleMock.mockResolvedValue({
      data: {
        avatar_url:
          "https://example.supabase.co/storage/v1/object/public/testimonial-avatars/550e8400-e29b-41d4-a716-446655440000/avatar/current.webp",
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
      error: null,
    });
    deleteMock.mockReturnValue({ eq: deleteEqMock });
    deleteEqMock.mockResolvedValue({ error: null });
    extractManagedTestimonialAvatarObjectPathFromUrlMock.mockReturnValue(
      "550e8400-e29b-41d4-a716-446655440000/avatar/current.webp",
    );
  });

  it("deletes the testimonial and redirects with a deleted status", async () => {
    const formData = new FormData();
    formData.set("confirmDelete", "true");
    formData.set("testimonialId", "550e8400-e29b-41d4-a716-446655440000");

    await expect(deleteAdminTestimonial(formData)).rejects.toThrow(
      "REDIRECT:/admin/testimonials?status=deleted",
    );

    expect(requireAdminAccessMock).toHaveBeenCalledWith(
      "/admin/testimonials/550e8400-e29b-41d4-a716-446655440000",
    );
    expect(fromMock).toHaveBeenCalledWith("testimonials");
    expect(deleteEqMock).toHaveBeenCalledWith(
      "id",
      "550e8400-e29b-41d4-a716-446655440000",
    );
    expect(deleteManagedTestimonialAvatarObjectsMock).toHaveBeenCalledWith([
      "550e8400-e29b-41d4-a716-446655440000/avatar/current.webp",
    ]);
    expect(revalidateTestimonialRoutesMock).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });
});
