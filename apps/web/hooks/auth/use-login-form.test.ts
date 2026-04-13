import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
vi.mock("@/lib/env/public", () => ({
  publicEnv: {
    hcaptchaSiteKey: "site-key",
    siteUrl: "https://scalzostudio.com",
  },
  publicFeatureFlags: {
    analyticsEnabled: false,
    calBookingEnabled: false,
    hcaptchaEnabled: true,
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("useLoginForm", () => {
  it("submits password login and redirects to the normalized next path", async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleCaptchaVerify("captcha-token");
      result.current.setEmail("admin@example.com");
      result.current.setPassword("secret");
    });

    await act(async () => {
      await result.current.handleLogin({
        preventDefault() {},
      } as FormEvent<HTMLFormElement>);
    });

    expect(mockSignInAdminWithPassword).toHaveBeenCalledWith({
      captchaToken: "captcha-token",
      email: "admin@example.com",
      password: "secret",
    });
    expect(mockReplace).toHaveBeenCalledWith("/admin/work");
  });

  it("requires hcaptcha before password login", async () => {
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

    expect(mockSignInAdminWithPassword).not.toHaveBeenCalled();
    expect(result.current.captchaError).toBe(
      "Complete the hCaptcha check before continuing.",
    );
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

  it("passes the captcha token when requesting a magic link", async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleCaptchaVerify("captcha-token");
      result.current.setEmail("admin@example.com");
    });

    await act(async () => {
      await result.current.handleMagicLinkLogin();
    });

    expect(mockRequestAdminMagicLink).toHaveBeenCalledWith({
      captchaToken: "captcha-token",
      email: "admin@example.com",
      next: "/admin/work",
      origin: window.location.origin,
    });
  });
});
