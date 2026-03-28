import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAdminShellState } from "./use-admin-shell-state";

describe("useAdminShellState", () => {
  it("reads persisted sidebar state, derives initials, and closes the menu on route changes", async () => {
    window.localStorage.setItem("scalzo-admin-sidebar-collapsed", "true");

    const { result, rerender } = renderHook(
      ({ pathname }) =>
        useAdminShellState({
          pathname,
          userEmail: "admin@example.com",
        }),
      {
        initialProps: { pathname: "/admin" },
      },
    );

    await waitFor(() => {
      expect(result.current.isSidebarCollapsed).toBe(true);
    });

    expect(result.current.profileInitials).toBe("AD");

    act(() => {
      result.current.toggleProfileMenu();
    });

    expect(result.current.isProfileMenuOpen).toBe(true);

    rerender({ pathname: "/admin/services" });

    await waitFor(() => {
      expect(result.current.isProfileMenuOpen).toBe(false);
    });
  });
});
