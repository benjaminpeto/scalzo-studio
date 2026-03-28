import { publicEnv } from "@/lib/env/public";

const emailBookingFallback = {
  href: "mailto:hello@scalzostudio.com?subject=Discovery%20call%20request",
  label: "Arrange a call by email",
} as const;

export interface BookingProviderConfig {
  provider: "cal" | null;
  bookingUrl: string | null;
  calLink: string | null;
  embedEnabled: boolean;
  origin: string | null;
  namespace: string | null;
}

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function resolveBookingProviderConfig(
  bookingUrl: string | null | undefined,
): BookingProviderConfig {
  if (!bookingUrl) {
    return {
      provider: null,
      bookingUrl: null,
      calLink: null,
      embedEnabled: false,
      origin: null,
      namespace: null,
    };
  }

  const parsedUrl = new URL(bookingUrl);
  const normalizedPathname = parsedUrl.pathname.replace(/^\/+/, "");
  const calLink = [normalizedPathname, parsedUrl.search.replace(/^\?/, "")]
    .filter(Boolean)
    .join("?");
  const namespaceSource = normalizedPathname.split("/").filter(Boolean).at(-1);
  const namespace =
    namespaceSource?.replace(/[^a-z0-9-]/gi, "-").toLowerCase() ?? "booking";

  return {
    provider: "cal",
    bookingUrl: trimTrailingSlash(bookingUrl),
    calLink,
    embedEnabled: Boolean(calLink),
    origin: trimTrailingSlash(parsedUrl.origin),
    namespace,
  };
}

export const bookingProviderConfig = resolveBookingProviderConfig(
  publicEnv.calBookingUrl,
);

export function getBookingAction() {
  if (!bookingProviderConfig.bookingUrl) {
    return emailBookingFallback;
  }

  return {
    href: bookingProviderConfig.bookingUrl,
    label: "Book a discovery call",
  } as const;
}

export function getEmailBookingFallback() {
  return emailBookingFallback;
}
