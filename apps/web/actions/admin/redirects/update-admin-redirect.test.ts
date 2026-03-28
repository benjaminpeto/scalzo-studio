// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  buildNormalizedRedirectPayloadMock,
  buildRedirectEditorFieldErrorsMock,
  createActionErrorStateMock,
  createActionSuccessStateMock,
  ensureUniqueRedirectFromPathMock,
  findInverseRedirectMock,
  fromMock,
  getAdminRedirectByIdMock,
  maybeSingleMock,
  readRedirectEditorFormDataMock,
  requireAdminAccessMock,
  revalidateRedirectRoutesMock,
  selectMock,
  updateMock,
} = vi.hoisted(() => ({
  buildNormalizedRedirectPayloadMock: vi.fn(),
  buildRedirectEditorFieldErrorsMock: vi.fn(),
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
  ensureUniqueRedirectFromPathMock: vi.fn(),
  findInverseRedirectMock: vi.fn(),
  fromMock: vi.fn(),
  getAdminRedirectByIdMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  readRedirectEditorFormDataMock: vi.fn(),
  requireAdminAccessMock: vi.fn(),
  revalidateRedirectRoutesMock: vi.fn(),
  selectMock: vi.fn(),
  updateMock: vi.fn(),
}));

vi.mock("@/actions/admin/server", () => ({
  requireCurrentAdminAccess: requireAdminAccessMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: () => ({
    from: fromMock,
  }),
}));

vi.mock("./get-admin-redirect-by-id", () => ({
  getAdminRedirectById: getAdminRedirectByIdMock,
}));

vi.mock("./helpers", async () => ({
  ...(await vi.importActual("./helpers")),
  buildNormalizedRedirectPayload: buildNormalizedRedirectPayloadMock,
  buildRedirectEditorFieldErrors: buildRedirectEditorFieldErrorsMock,
  createActionErrorState: createActionErrorStateMock,
  createActionSuccessState: createActionSuccessStateMock,
  ensureUniqueRedirectFromPath: ensureUniqueRedirectFromPathMock,
  findInverseRedirect: findInverseRedirectMock,
  readRedirectEditorFormData: readRedirectEditorFormDataMock,
  revalidateRedirectRoutes: revalidateRedirectRoutesMock,
}));

import { updateAdminRedirect } from "./update-admin-redirect";

describe("updateAdminRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({
      update: updateMock,
    });
    updateMock.mockReturnValue({
      eq: vi.fn(() => ({
        select: selectMock,
      })),
    });
    selectMock.mockReturnValue({
      maybeSingle: maybeSingleMock,
    });
    maybeSingleMock.mockResolvedValue({
      data: { id: "550e8400-e29b-41d4-a716-446655440000" },
      error: null,
    });
    ensureUniqueRedirectFromPathMock.mockResolvedValue(false);
    findInverseRedirectMock.mockResolvedValue(null);
    getAdminRedirectByIdMock.mockResolvedValue({
      fromPath: "/old-service",
      id: "550e8400-e29b-41d4-a716-446655440000",
      statusCode: 301,
      toPath: "/services/new-service",
      updatedAt: "2026-03-28T10:00:00.000Z",
    });
    readRedirectEditorFormDataMock.mockReturnValue({
      fromPath: "/old-service",
      redirectId: "550e8400-e29b-41d4-a716-446655440000",
      statusCode: "302",
      toPath: "/services/new-service",
    });
    buildNormalizedRedirectPayloadMock.mockReturnValue({
      errorState: null,
      payload: {
        fromPath: "/old-service",
        statusCode: 302,
        toPath: "/services/new-service",
      },
    });
  });

  it("updates a redirect successfully", async () => {
    const result = await updateAdminRedirect(
      {
        fieldErrors: {},
        message: null,
        redirectTo: null,
        status: "idle",
      },
      new FormData(),
    );

    expect(requireAdminAccessMock).toHaveBeenCalledWith(
      "/admin/redirects/550e8400-e29b-41d4-a716-446655440000",
    );
    expect(fromMock).toHaveBeenCalledWith("redirects");
    expect(updateMock).toHaveBeenCalledWith({
      from_path: "/old-service",
      status_code: 302,
      to_path: "/services/new-service",
    });
    expect(revalidateRedirectRoutesMock).toHaveBeenCalledWith([
      "550e8400-e29b-41d4-a716-446655440000",
      "550e8400-e29b-41d4-a716-446655440000",
    ]);
    expect(result).toMatchObject({
      redirectTo:
        "/admin/redirects/550e8400-e29b-41d4-a716-446655440000?status=saved",
      status: "success",
    });
  });

  it("rejects duplicate source paths on update", async () => {
    ensureUniqueRedirectFromPathMock.mockResolvedValue(true);

    const result = await updateAdminRedirect(
      {
        fieldErrors: {},
        message: null,
        redirectTo: null,
        status: "idle",
      },
      new FormData(),
    );

    expect(result).toMatchObject({
      fieldErrors: {
        fromPath: "That source path is already in use by another redirect.",
      },
      status: "error",
    });
  });
});
