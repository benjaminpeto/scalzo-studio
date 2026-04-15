// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildNormalizedTestimonialPayloadMock,
  buildTestimonialEditorFieldErrorsMock,
  createActionErrorStateMock,
  createActionSuccessStateMock,
  deleteManagedTestimonialAvatarObjectsMock,
  getAdminTestimonialByIdMock,
  isFileEntryMock,
  normalizeStringEntryMock,
  readTestimonialEditorFormDataMock,
  requireAdminAccessMock,
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
  getAdminTestimonialByIdMock: vi.fn(),
  isFileEntryMock: vi.fn(),
  normalizeStringEntryMock: vi.fn((value: FormDataEntryValue | null) =>
    typeof value === "string" ? value : "",
  ),
  readTestimonialEditorFormDataMock: vi.fn(),
  requireAdminAccessMock: vi.fn(),
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
  createServerSupabaseClient: vi.fn(),
}));

vi.mock("./get-admin-testimonial-by-id", () => ({
  getAdminTestimonialById: getAdminTestimonialByIdMock,
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
}));

vi.mock("./storage", () => ({
  deleteManagedTestimonialAvatarObjects:
    deleteManagedTestimonialAvatarObjectsMock,
  uploadTestimonialAvatar: uploadTestimonialAvatarMock,
}));

import { updateAdminTestimonial } from "./update-admin-testimonial";

describe("updateAdminTestimonial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteManagedTestimonialAvatarObjectsMock.mockResolvedValue(undefined);
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
      testimonialId: "550e8400-e29b-41d4-a716-446655440000",
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
    getAdminTestimonialByIdMock.mockResolvedValue({
      avatar: {
        alt: "Portrait of Marina Ortega",
        height: 800,
        src: "https://example.supabase.co/storage/v1/object/public/testimonial-avatars/550e8400-e29b-41d4-a716-446655440000/avatar/current.webp",
        width: 800,
      },
      company: "Northshore",
      featured: false,
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Marina Ortega",
      published: false,
      quote: "Existing quote.",
      role: "Founder",
      updatedAt: "2026-03-28T10:00:00.000Z",
    });
  });

  it("returns a field error when replacement avatar upload validation fails", async () => {
    isFileEntryMock.mockReturnValue(true);
    uploadTestimonialAvatarMock.mockRejectedValue(
      new Error("File size 12000000 exceeds the 10485760-byte limit."),
    );

    const result = await updateAdminTestimonial(
      {
        fieldErrors: {},
        message: null,
        redirectTo: null,
        status: "idle",
      },
      new FormData(),
    );

    expect(requireAdminAccessMock).toHaveBeenCalledWith(
      "/admin/testimonials/550e8400-e29b-41d4-a716-446655440000",
    );
    expect(result).toMatchObject({
      fieldErrors: {
        avatar: "File size 12000000 exceeds the 10485760-byte limit.",
      },
      message: "File size 12000000 exceeds the 10485760-byte limit.",
      status: "error",
    });
  });
});
