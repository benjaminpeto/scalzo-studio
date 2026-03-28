// @vitest-environment node

import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createProxySupabaseContextMock: vi.fn(),
  getAdminAppRouteRedirectMock: vi.fn(),
  getClaimsMock: vi.fn(),
  getRuntimeRedirectResponseMock: vi.fn(),
  isAdminAppRouteMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/actions/admin/server", () => ({
  getAdminAppRouteRedirect: mocks.getAdminAppRouteRedirectMock,
  isAdminAppRoute: mocks.isAdminAppRouteMock,
}));

vi.mock("@/actions/session/runtime-redirects", () => ({
  getRuntimeRedirectResponse: mocks.getRuntimeRedirectResponseMock,
}));

vi.mock("@/lib/supabase/proxy", () => ({
  createProxySupabaseContext: mocks.createProxySupabaseContextMock,
}));

import { updateSession } from "./server";

function mockProxyContext() {
  const response = NextResponse.next();

  response.cookies.set("sb-access-token", "refreshed");

  mocks.createProxySupabaseContextMock.mockReturnValue({
    response,
    supabase: {
      auth: {
        getClaims: mocks.getClaimsMock,
      },
    },
  });

  return response;
}

describe("updateSession", () => {
  beforeEach(() => {
    mocks.createProxySupabaseContextMock.mockReset();
    mocks.getAdminAppRouteRedirectMock.mockReset();
    mocks.getClaimsMock.mockReset();
    mocks.getRuntimeRedirectResponseMock.mockReset();
    mocks.isAdminAppRouteMock.mockReset();
  });

  it("returns the proxy response for non-admin routes when no runtime redirect matches", async () => {
    const proxyResponse = mockProxyContext();

    mocks.getRuntimeRedirectResponseMock.mockResolvedValueOnce(null);
    mocks.isAdminAppRouteMock.mockReturnValueOnce(false);

    const response = await updateSession(
      new NextRequest("https://example.com/services"),
    );

    expect(response).toBe(proxyResponse);
    expect(mocks.getClaimsMock).not.toHaveBeenCalled();
  });

  it("redirects anonymous admin requests to login and preserves refreshed cookies", async () => {
    mockProxyContext();

    mocks.getRuntimeRedirectResponseMock.mockResolvedValueOnce(null);
    mocks.isAdminAppRouteMock.mockReturnValueOnce(true);
    mocks.getClaimsMock.mockResolvedValueOnce({
      data: {
        claims: null,
      },
    });

    const response = await updateSession(
      new NextRequest("https://example.com/admin/services?view=all"),
    );

    expect(response.headers.get("location")).toBe(
      "https://example.com/auth/login?view=all&next=%2Fadmin%2Fservices%3Fview%3Dall",
    );
    expect(response.cookies.get("sb-access-token")?.value).toBe("refreshed");
  });

  it("keeps the existing admin authorization redirect behavior", async () => {
    mockProxyContext();

    mocks.getRuntimeRedirectResponseMock.mockResolvedValueOnce(null);
    mocks.isAdminAppRouteMock.mockReturnValueOnce(true);
    mocks.getClaimsMock.mockResolvedValueOnce({
      data: {
        claims: {
          sub: "user-123",
        },
      },
    });
    mocks.getAdminAppRouteRedirectMock.mockResolvedValueOnce(
      "/auth/login?error=access-denied",
    );

    const response = await updateSession(
      new NextRequest("https://example.com/admin"),
    );

    expect(mocks.getAdminAppRouteRedirectMock).toHaveBeenCalledWith({
      pathname: "/admin",
      supabase: expect.any(Object),
      userId: "user-123",
    });
    expect(response.headers.get("location")).toBe(
      "https://example.com/auth/login?error=access-denied",
    );
    expect(response.cookies.get("sb-access-token")?.value).toBe("refreshed");
  });
});
