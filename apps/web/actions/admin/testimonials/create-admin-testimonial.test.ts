// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildNormalizedTestimonialPayloadMock,
  buildTestimonialEditorFieldErrorsMock,
  createActionErrorStateMock,
  createActionSuccessStateMock,
  deleteManagedTestimonialAvatarObjectsMock,
  fromMock,
  insertMock,
  isFileEntryMock,
  normalizeStringEntryMock,
  readTestimonialEditorFormDataMock,
  requireAdminAccessMock,
  revalidateTestimonialRoutesMock,
  uploadTestimonialAvatarMock,
} = vi.hoisted(() => ({
  buildNormalizedTestimonialPayloadMock: vi.fn(),
  buildTestimonialEditorFieldErrorsMock: vi.fn(),
  createActionErrorStateMock: vi.fn(
    (message: string, fieldErrors: Record<string, string> = {}) => ({
      fieldErrors,
      message,
      redirectTo: null,
      status: "error",
    }),
  ),
  createActionSuccessStateMock: vi.fn(
    ({ message, redirectTo }: { message: string; redirectTo: string }) => ({
      fieldErrors: {},
      message,
      redirectTo,
      status: "success",
    }),
  ),
  deleteManagedTestimonialAvatarObjectsMock: vi.fn(),
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  isFileEntryMock: vi.fn(),
  normalizeStringEntryMock: vi.fn((value: FormDataEntryValue | null) =>
    typeof value === "string" ? value : "",
  ),
  readTestimonialEditorFormDataMock: vi.fn(),
  requireAdminAccessMock: vi.fn(),
  revalidateTestimonialRoutesMock: vi.fn(),
  uploadTestimonialAvatarMock: vi.fn(),
}));

vi.mock("@/lib/env/public", () => ({
  publicEnv: {
    siteUrl: "https://example.com",
    supabaseUrl: "https://example.supabase.co",
  },
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
  buildNormalizedTestimonialPayload: buildNormalizedTestimonialPayloadMock,
  buildTestimonialEditorFieldErrors: buildTestimonialEditorFieldErrorsMock,
  createActionErrorState: createActionErrorStateMock,
  createActionSuccessState: createActionSuccessStateMock,
  isFileEntry: isFileEntryMock,
  normalizeStringEntry: normalizeStringEntryMock,
  readTestimonialEditorFormData: readTestimonialEditorFormDataMock,
  revalidateTestimonialRoutes: revalidateTestimonialRoutesMock,
}));

vi.mock("./storage", () => ({
  deleteManagedTestimonialAvatarObjects:
    deleteManagedTestimonialAvatarObjectsMock,
  uploadTestimonialAvatar: uploadTestimonialAvatarMock,
}));

import { createAdminTestimonial } from "./create-admin-testimonial";

describe("createAdminTestimonial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "550e8400-e29b-41d4-a716-446655440000",
    );
    deleteManagedTestimonialAvatarObjectsMock.mockResolvedValue(undefined);
    fromMock.mockReturnValue({ insert: insertMock });
    insertMock.mockResolvedValue({ error: null });
    readTestimonialEditorFormDataMock.mockReturnValue({
      avatar: new File(["avatar"], "avatar.webp", { type: "image/webp" }),
      avatarAlt: "Portrait of Marina Ortega",
      company: "Northshore",
      featured: true,
      name: "Marina Ortega",
      published: true,
      quote: "Clear strategy and sharp execution.",
      removeAvatar: false,
      role: "Founder",
      testimonialId: null,
    });
    buildNormalizedTestimonialPayloadMock.mockReturnValue({
      errorState: null,
      payload: {
        company: "Northshore",
        featured: true,
        name: "Marina Ortega",
        published: true,
        quote: "Clear strategy and sharp execution.",
        role: "Founder",
      },
    });
  });

  it("creates a testimonial with an uploaded avatar", async () => {
    isFileEntryMock.mockReturnValue(true);
    uploadTestimonialAvatarMock.mockResolvedValue({
      objectPath: "550e8400-e29b-41d4-a716-446655440000/avatar/avatar.webp",
      publicUrl:
        "https://example.supabase.co/storage/v1/object/public/testimonial-avatars/550e8400-e29b-41d4-a716-446655440000/avatar/avatar.webp",
    });

    const result = await createAdminTestimonial(
      {
        fieldErrors: {},
        message: null,
        redirectTo: null,
        status: "idle",
      },
      new FormData(),
    );

    expect(requireAdminAccessMock).toHaveBeenCalledWith(
      "/admin/testimonials/new",
    );
    expect(uploadTestimonialAvatarMock).toHaveBeenCalledWith({
      altText: "Portrait of Marina Ortega",
      file: expect.any(File),
      testimonialId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(fromMock).toHaveBeenCalledWith("testimonials");
    expect(insertMock).toHaveBeenCalledWith({
      avatar_url:
        "https://example.supabase.co/storage/v1/object/public/testimonial-avatars/550e8400-e29b-41d4-a716-446655440000/avatar/avatar.webp",
      company: "Northshore",
      featured: true,
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Marina Ortega",
      published: true,
      quote: "Clear strategy and sharp execution.",
      role: "Founder",
    });
    expect(revalidateTestimonialRoutesMock).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
    );
    expect(result).toMatchObject({
      redirectTo:
        "/admin/testimonials/550e8400-e29b-41d4-a716-446655440000?status=created",
      status: "success",
    });
  });

  it("returns a field error when avatar upload validation fails", async () => {
    isFileEntryMock.mockReturnValue(true);
    uploadTestimonialAvatarMock.mockRejectedValue(
      new Error('Unsupported content type "text/plain".'),
    );

    const result = await createAdminTestimonial(
      {
        fieldErrors: {},
        message: null,
        redirectTo: null,
        status: "idle",
      },
      new FormData(),
    );

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      fieldErrors: {
        avatar: 'Unsupported content type "text/plain".',
      },
      message: 'Unsupported content type "text/plain".',
      status: "error",
    });
  });
});
