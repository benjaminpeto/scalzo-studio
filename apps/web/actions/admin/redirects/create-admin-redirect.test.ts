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
  insertMock,
  maybeSingleMock,
  readRedirectEditorFormDataMock,
  requireAdminAccessMock,
  revalidateRedirectRoutesMock,
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
  insertMock: vi.fn(),
  maybeSingleMock: vi.fn(),
  readRedirectEditorFormDataMock: vi.fn(),
  requireAdminAccessMock: vi.fn(),
  revalidateRedirectRoutesMock: vi.fn(),
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
  buildNormalizedRedirectPayload: buildNormalizedRedirectPayloadMock,
  buildRedirectEditorFieldErrors: buildRedirectEditorFieldErrorsMock,
  createActionErrorState: createActionErrorStateMock,
  createActionSuccessState: createActionSuccessStateMock,
  ensureUniqueRedirectFromPath: ensureUniqueRedirectFromPathMock,
  findInverseRedirect: findInverseRedirectMock,
  readRedirectEditorFormData: readRedirectEditorFormDataMock,
  revalidateRedirectRoutes: revalidateRedirectRoutesMock,
}));

import { createAdminRedirect } from "./create-admin-redirect";

describe("createAdminRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({
      insert: insertMock,
    });
    insertMock.mockReturnValue({
      select: vi.fn(() => ({
        maybeSingle: maybeSingleMock,
      })),
    });
    maybeSingleMock.mockResolvedValue({
      data: { id: "550e8400-e29b-41d4-a716-446655440000" },
      error: null,
    });
    ensureUniqueRedirectFromPathMock.mockResolvedValue(false);
    findInverseRedirectMock.mockResolvedValue(null);
    readRedirectEditorFormDataMock.mockReturnValue({
      fromPath: "/old-service",
      redirectId: null,
      statusCode: "301",
      toPath: "/services/new-service",
    });
    buildNormalizedRedirectPayloadMock.mockReturnValue({
      errorState: null,
      payload: {
        fromPath: "/old-service",
        statusCode: 301,
        toPath: "/services/new-service",
      },
    });
  });

  it("creates a redirect successfully", async () => {
    const result = await createAdminRedirect(
      {
        fieldErrors: {},
        message: null,
        redirectTo: null,
        status: "idle",
      },
      new FormData(),
    );

    expect(requireAdminAccessMock).toHaveBeenCalledWith("/admin/redirects/new");
    expect(fromMock).toHaveBeenCalledWith("redirects");
    expect(insertMock).toHaveBeenCalledWith({
      from_path: "/old-service",
      status_code: 301,
      to_path: "/services/new-service",
    });
    expect(revalidateRedirectRoutesMock).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
    );
    expect(result).toMatchObject({
      redirectTo:
        "/admin/redirects/550e8400-e29b-41d4-a716-446655440000?status=created",
      status: "success",
    });
  });

  it("rejects duplicate source paths", async () => {
    ensureUniqueRedirectFromPathMock.mockResolvedValue(true);

    const result = await createAdminRedirect(
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

  it("rejects direct inverse loops", async () => {
    findInverseRedirectMock.mockResolvedValue({
      fromPath: "/services/new-service",
      toPath: "/old-service",
    });

    const result = await createAdminRedirect(
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
        toPath:
          "This would create a direct redirect loop with an existing reverse rule.",
      },
      status: "error",
    });
  });
});
