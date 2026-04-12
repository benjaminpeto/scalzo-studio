import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MarketingPageViewTracker } from "./marketing-page-view-tracker";

const mocks = vi.hoisted(() => ({
  capturePageView: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mocks.usePathname,
}));

vi.mock("@/lib/analytics/client", () => ({
  capturePageView: mocks.capturePageView,
}));

describe("MarketingPageViewTracker", () => {
  beforeEach(() => {
    mocks.capturePageView.mockReset();
    mocks.usePathname.mockReset();
  });

  it("captures a page view for the active marketing pathname", () => {
    mocks.usePathname.mockReturnValue("/services");

    render(<MarketingPageViewTracker />);

    expect(mocks.capturePageView).toHaveBeenCalledWith("/services");
  });
});
