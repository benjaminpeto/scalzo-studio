import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BookingProviderConfig } from "@/lib/booking/config";

const mocks = vi.hoisted(() => ({
  bookingProviderConfig: {
    provider: null,
    bookingUrl: null,
    calLink: null,
    embedEnabled: false,
    namespace: null,
    origin: null,
  } as BookingProviderConfig,
  calComponentMock: vi.fn(),
  getBookingActionMock: vi.fn(),
  getCalApiMock: vi.fn(),
}));

vi.mock("@/lib/booking/config", () => ({
  bookingProviderConfig: mocks.bookingProviderConfig,
  getBookingAction: mocks.getBookingActionMock,
}));

vi.mock("@calcom/embed-react", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    mocks.calComponentMock(props);
    return <div data-testid="cal-booking-embed" />;
  },
  getCalApi: mocks.getCalApiMock,
}));

describe("BookingPanel", () => {
  beforeEach(() => {
    mocks.bookingProviderConfig.provider = null;
    mocks.bookingProviderConfig.bookingUrl = null;
    mocks.bookingProviderConfig.calLink = null;
    mocks.bookingProviderConfig.embedEnabled = false;
    mocks.bookingProviderConfig.namespace = null;
    mocks.bookingProviderConfig.origin = null;
    mocks.calComponentMock.mockReset();
    mocks.getBookingActionMock.mockReset();
    mocks.getCalApiMock.mockReset();
    mocks.getBookingActionMock.mockReturnValue({
      href: "mailto:hello@scalzostudio.com?subject=Discovery%20call%20request",
      label: "Arrange a call by email",
    });
    mocks.getCalApiMock.mockResolvedValue(vi.fn());
  });

  it("renders the email fallback state when Cal.com is not configured", async () => {
    const { BookingPanel } = await import("./booking-panel");

    render(<BookingPanel />);

    expect(
      screen.getByText(
        "Add `NEXT_PUBLIC_CAL_BOOKING_URL` to replace this fallback with the live scheduler.",
      ),
    ).not.toBeNull();
    expect(
      screen.getByRole("link", { name: "Arrange a call by email" }),
    ).not.toBeNull();
    expect(
      screen
        .getByRole("link", { name: "Arrange a call by email" })
        .getAttribute("href"),
    ).toBe("mailto:hello@scalzostudio.com?subject=Discovery%20call%20request");
  });

  it("renders the Cal.com embed surface and direct booking CTA when configured", async () => {
    const calMock = vi.fn();

    mocks.bookingProviderConfig.provider = "cal";
    mocks.bookingProviderConfig.bookingUrl =
      "https://cal.eu/scalzostudio/discovery-call";
    mocks.bookingProviderConfig.calLink = "scalzostudio/discovery-call";
    mocks.bookingProviderConfig.embedEnabled = true;
    mocks.bookingProviderConfig.namespace = "discovery-call";
    mocks.bookingProviderConfig.origin = "https://cal.com";
    mocks.getBookingActionMock.mockReturnValue({
      href: "https://cal.eu/scalzostudio/discovery-call",
      label: "Book a discovery call",
    });
    mocks.getCalApiMock.mockResolvedValue(calMock);

    const { BookingPanel } = await import("./booking-panel");

    render(<BookingPanel />);

    await waitFor(() => {
      expect(screen.getByTestId("cal-booking-embed")).not.toBeNull();
    });
    expect(
      screen.getByRole("link", { name: "Book a discovery call" }),
    ).not.toBeNull();
    expect(
      screen
        .getByRole("link", { name: "Book a discovery call" })
        .getAttribute("href"),
    ).toBe("https://cal.eu/scalzostudio/discovery-call");
    expect(mocks.getCalApiMock).toHaveBeenCalledWith({
      namespace: "discovery-call",
    });
    expect(mocks.calComponentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        calLink: "scalzostudio/discovery-call",
        namespace: "discovery-call",
      }),
    );
  });

  it("replaces the embed with a success state after bookingSuccessfulV2", async () => {
    const handlers: Record<string, (event: unknown) => void> = {};
    const calMock = vi.fn((action: string, payload?: unknown) => {
      if (
        action === "on" &&
        payload &&
        typeof payload === "object" &&
        "action" in payload &&
        "callback" in payload
      ) {
        handlers[String(payload.action)] = payload.callback as (
          event: unknown,
        ) => void;
      }
    });

    mocks.bookingProviderConfig.provider = "cal";
    mocks.bookingProviderConfig.bookingUrl =
      "https://cal.eu/scalzostudio/discovery-call";
    mocks.bookingProviderConfig.calLink = "scalzostudio/discovery-call";
    mocks.bookingProviderConfig.embedEnabled = true;
    mocks.bookingProviderConfig.namespace = "discovery-call";
    mocks.bookingProviderConfig.origin = "https://cal.com";
    mocks.getBookingActionMock.mockReturnValue({
      href: "https://cal.eu/scalzostudio/discovery-call",
      label: "Book a discovery call",
    });
    mocks.getCalApiMock.mockResolvedValue(calMock);

    const { BookingPanel } = await import("./booking-panel");

    render(<BookingPanel />);

    await waitFor(() => {
      expect(handlers.bookingSuccessfulV2).toBeDefined();
    });

    handlers.bookingSuccessfulV2({
      detail: {
        data: {
          startTime: "2026-04-01T10:00:00.000Z",
          title: "Discovery Call",
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("cal-booking-success")).not.toBeNull();
    });
    expect(screen.getByText("Your slot is confirmed.")).not.toBeNull();
    expect(screen.getByText("Session: Discovery Call")).not.toBeNull();
  });
});
