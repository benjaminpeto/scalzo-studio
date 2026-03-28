// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import {
  buildNormalizedRedirectPayload,
  buildRedirectsReturnPath,
  filterAdminRedirects,
  getRedirectSearchText,
  isInverseRedirectLoop,
  isSelfRedirectLoop,
  normalizeInternalRedirectPath,
  summarizeAdminRedirects,
} from "./helpers";

describe("redirects helpers", () => {
  it("normalizes internal paths and preserves query strings and hashes", () => {
    expect(normalizeInternalRedirectPath(" /services/new/ ")).toEqual({
      error: null,
      value: "/services/new",
    });
    expect(
      normalizeInternalRedirectPath("/work/case-study/?ref=nav#results"),
    ).toEqual({
      error: null,
      value: "/work/case-study?ref=nav#results",
    });
  });

  it("builds the filtered return path", () => {
    expect(
      buildRedirectsReturnPath({
        query: "/old-service",
        status: "deleted",
        statusCodeFilter: "301",
      }),
    ).toBe("/admin/redirects?q=%2Fold-service&statusCode=301&status=deleted");
  });

  it("filters redirect records by query and status code", () => {
    const redirects = [
      {
        fromPath: "/old-service",
        id: "550e8400-e29b-41d4-a716-446655440000",
        searchText: getRedirectSearchText({
          fromPath: "/old-service",
          toPath: "/services/new-service",
        }),
        statusCode: 301 as const,
        toPath: "/services/new-service",
        updatedAt: "2026-03-28T10:00:00.000Z",
      },
      {
        fromPath: "/promo",
        id: "550e8400-e29b-41d4-a716-446655440001",
        searchText: getRedirectSearchText({
          fromPath: "/promo",
          toPath: "/contact",
        }),
        statusCode: 302 as const,
        toPath: "/contact",
        updatedAt: "2026-03-27T10:00:00.000Z",
      },
    ];

    expect(
      filterAdminRedirects(redirects, {
        query: "service",
        statusCodeFilter: "301",
      }),
    ).toHaveLength(1);
    expect(
      summarizeAdminRedirects(
        redirects.map((redirectRecord) => ({
          fromPath: redirectRecord.fromPath,
          id: redirectRecord.id,
          statusCode: redirectRecord.statusCode,
          toPath: redirectRecord.toPath,
          updatedAt: redirectRecord.updatedAt,
        })),
      ),
    ).toEqual({
      status301Count: 1,
      status302Count: 1,
      totalCount: 2,
    });
  });

  it("detects self-loops and inverse loops", () => {
    expect(
      isSelfRedirectLoop({
        fromPath: "/services",
        toPath: "/services",
      }),
    ).toBe(true);
    expect(
      isInverseRedirectLoop({
        fromPath: "/old-service",
        inverseRedirect: {
          fromPath: "/services/new-service",
          toPath: "/old-service",
        },
        toPath: "/services/new-service",
      }),
    ).toBe(true);
  });

  it("returns field errors for invalid external and self-loop paths", () => {
    expect(
      buildNormalizedRedirectPayload({
        fromPath: "https://example.com",
        statusCode: "301",
        toPath: "/services",
      }),
    ).toMatchObject({
      errorState: {
        fieldErrors: {
          fromPath: "Enter an internal path that starts with /.",
        },
      },
      payload: null,
    });

    expect(
      buildNormalizedRedirectPayload({
        fromPath: "/services/",
        statusCode: "301",
        toPath: "/services",
      }),
    ).toMatchObject({
      errorState: {
        fieldErrors: {
          toPath:
            "The destination path cannot match the source path after normalization.",
        },
      },
      payload: null,
    });
  });
});
