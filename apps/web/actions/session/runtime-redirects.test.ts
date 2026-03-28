// @vitest-environment node

import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const inMock = vi.fn();
  const selectMock = vi.fn(() => ({
    in: inMock,
  }));
  const fromMock = vi.fn(() => ({
    select: selectMock,
  }));

  return {
    createServiceRoleSupabaseClientMock: vi.fn(() => ({
      from: fromMock,
    })),
    fromMock,
    inMock,
    selectMock,
    serverFeatureFlags: {
      serviceRoleEnabled: true,
    },
  };
});

vi.mock("server-only", () => ({}));

vi.mock("@/lib/env/server", () => ({
  serverFeatureFlags: mocks.serverFeatureFlags,
}));

vi.mock("@/lib/supabase/service-role", () => ({
  createServiceRoleSupabaseClient: mocks.createServiceRoleSupabaseClientMock,
}));

import {
  buildRuntimeRedirectLookupCandidates,
  getRuntimeRedirectResponse,
  shouldBypassRuntimeRedirectLookup,
} from "./runtime-redirects";

describe("runtime redirects", () => {
  beforeEach(() => {
    mocks.serverFeatureFlags.serviceRoleEnabled = true;
    mocks.createServiceRoleSupabaseClientMock.mockClear();
    mocks.fromMock.mockClear();
    mocks.inMock.mockReset();
    mocks.selectMock.mockClear();
    vi.restoreAllMocks();
  });

  it("skips excluded routes and non-GET requests", () => {
    expect(
      shouldBypassRuntimeRedirectLookup({
        method: "GET",
        pathname: "/admin/redirects",
      }),
    ).toBe(true);
    expect(
      shouldBypassRuntimeRedirectLookup({
        method: "POST",
        pathname: "/services",
      }),
    ).toBe(true);
    expect(
      shouldBypassRuntimeRedirectLookup({
        method: "HEAD",
        pathname: "/work/case-study",
      }),
    ).toBe(false);
  });

  it("builds query-first lookup candidates with normalized trailing slashes", () => {
    expect(
      buildRuntimeRedirectLookupCandidates({
        pathname: "/services/new/",
        search: "?ref=nav",
      }),
    ).toEqual(["/services/new?ref=nav", "/services/new"]);
  });

  it("returns the exact query match before the pathname fallback", async () => {
    mocks.inMock.mockResolvedValueOnce({
      data: [
        {
          from_path: "/promo",
          status_code: 301,
          to_path: "/contact",
        },
        {
          from_path: "/promo?utm=campaign",
          status_code: 302,
          to_path: "/contact?source=campaign#brief",
        },
      ],
      error: null,
    });

    const proxyResponse = NextResponse.next();
    proxyResponse.cookies.set("sb-test", "refreshed");

    const response = await getRuntimeRedirectResponse({
      request: new NextRequest("https://example.com/promo/?utm=campaign"),
      response: proxyResponse,
    });

    expect(mocks.fromMock).toHaveBeenCalledWith("redirects");
    expect(mocks.inMock).toHaveBeenCalledWith("from_path", [
      "/promo?utm=campaign",
      "/promo",
    ]);
    expect(response?.status).toBe(302);
    expect(response?.headers.get("location")).toBe(
      "https://example.com/contact?source=campaign#brief",
    );
    expect(response?.cookies.get("sb-test")?.value).toBe("refreshed");
  });

  it("falls back to a pathname-only redirect when no query-specific match exists", async () => {
    mocks.inMock.mockResolvedValueOnce({
      data: [
        {
          from_path: "/promo",
          status_code: 301,
          to_path: "/contact",
        },
      ],
      error: null,
    });

    const response = await getRuntimeRedirectResponse({
      request: new NextRequest("https://example.com/promo?utm=campaign"),
      response: NextResponse.next(),
    });

    expect(response?.status).toBe(301);
    expect(response?.headers.get("location")).toBe(
      "https://example.com/contact",
    );
  });

  it("skips self-resolving redirects after runtime normalization", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    mocks.inMock.mockResolvedValueOnce({
      data: [
        {
          from_path: "/promo?utm=campaign",
          status_code: 302,
          to_path: "/promo?utm=campaign#hero",
        },
      ],
      error: null,
    });

    const response = await getRuntimeRedirectResponse({
      request: new NextRequest("https://example.com/promo?utm=campaign"),
      response: NextResponse.next(),
    });

    expect(response).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Runtime redirect skipped because it resolves to itself",
      expect.objectContaining({
        fromPath: "/promo?utm=campaign",
        requestTarget: "/promo?utm=campaign",
        toPath: "/promo?utm=campaign#hero",
      }),
    );
  });

  it("falls through safely when the service-role client is unavailable", async () => {
    mocks.serverFeatureFlags.serviceRoleEnabled = false;

    const response = await getRuntimeRedirectResponse({
      request: new NextRequest("https://example.com/promo"),
      response: NextResponse.next(),
    });

    expect(response).toBeNull();
    expect(mocks.createServiceRoleSupabaseClientMock).not.toHaveBeenCalled();
  });

  it("falls through safely when the lookup errors", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    mocks.inMock.mockResolvedValueOnce({
      data: null,
      error: {
        code: "XX000",
        details: "boom",
        hint: null,
        message: "Lookup failed",
      },
    });

    const response = await getRuntimeRedirectResponse({
      request: new NextRequest("https://example.com/promo"),
      response: NextResponse.next(),
    });

    expect(response).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Runtime redirect lookup failed",
      {
        code: "XX000",
        details: "boom",
        hint: null,
        message: "Lookup failed",
      },
    );
  });
});
