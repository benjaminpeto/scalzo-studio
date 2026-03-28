import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { describe, expect, it, vi } from "vitest";

import { useLoginForm } from "./use-login-form";

const mockReplace = vi.fn();
const mockSearchParams = new URLSearchParams("next=%2Fadmin%2Fwork");
const mockRequestAdminMagicLink = vi.fn();
const mockSignInAdminWithPassword = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/actions/auth/client", () => ({
  requestAdminMagicLink: (...args: unknown[]) =>
    mockRequestAdminMagicLink(...args),
  signInAdminWithPassword: (...args: unknown[]) =>
    mockSignInAdminWithPassword(...args),
}));

describe("useLoginForm", () => {
  it("submits password login and redirects to the normalized next path", async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setEmail("admin@example.com");
      result.current.setPassword("secret");
    });

    await act(async () => {
      await result.current.handleLogin({
        preventDefault() {},
      } as FormEvent<HTMLFormElement>);
    });

    expect(mockSignInAdminWithPassword).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "secret",
    });
    expect(mockReplace).toHaveBeenCalledWith("/admin/work");
  });

  it("returns a validation message when requesting a magic link without an email", async () => {
    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      await result.current.handleMagicLinkLogin();
    });

    expect(result.current.error).toBe(
      "Enter your email to request a magic link.",
    );
  });
});
