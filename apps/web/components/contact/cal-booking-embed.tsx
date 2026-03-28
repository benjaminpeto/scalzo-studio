"use client";

import { useEffect, useId, useMemo, useState } from "react";

import type { BookingProviderConfig } from "@/lib/booking/config";

const CAL_EMBED_SCRIPT_SRC = "https://app.cal.com/embed/embed.js";
const CAL_LINK_FAILED_MESSAGE =
  "The inline scheduler could not load right now. Use the direct booking link instead.";

interface CalBookingEmbedProps {
  bookingConfig: BookingProviderConfig;
}

interface BookingSuccessData {
  endTime?: string;
  startTime?: string;
  status?: string;
  title?: string;
  uid?: string;
}

interface CalEventPayload {
  detail?: {
    data?: BookingSuccessData;
    namespace?: string;
    type?: string;
  };
}

type CalNamespaceApi = (action: string, payload?: unknown) => void;
type CalApi = ((
  action: string,
  payload?: unknown,
  options?: unknown,
) => void) & {
  config?: {
    forwardQueryParams?: boolean;
  };
  ns?: Record<string, CalNamespaceApi>;
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

let calEmbedScriptPromise: Promise<CalApi> | null = null;

function loadCalEmbedScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cal embed can only load in the browser."));
  }

  if (typeof window.Cal === "function") {
    return Promise.resolve(window.Cal);
  }

  if (calEmbedScriptPromise) {
    return calEmbedScriptPromise;
  }

  calEmbedScriptPromise = new Promise<CalApi>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-cal-embed="true"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (typeof window.Cal === "function") {
          resolve(window.Cal);
          return;
        }

        reject(new Error("Cal embed loaded without exposing window.Cal."));
      });
      existingScript.addEventListener("error", () => {
        reject(new Error("Cal embed failed to load."));
      });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.dataset.calEmbed = "true";
    script.src = CAL_EMBED_SCRIPT_SRC;
    script.addEventListener("load", () => {
      if (typeof window.Cal === "function") {
        resolve(window.Cal);
        return;
      }

      reject(new Error("Cal embed loaded without exposing window.Cal."));
    });
    script.addEventListener("error", () => {
      reject(new Error("Cal embed failed to load."));
    });
    document.head.appendChild(script);
  });

  return calEmbedScriptPromise;
}

function formatBookingStartTime(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function CalBookingEmbed({ bookingConfig }: CalBookingEmbedProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [bookingSuccess, setBookingSuccess] =
    useState<BookingSuccessData | null>(null);
  const rawEmbedId = useId();
  const embedId = useMemo(
    () => `cal-booking-${rawEmbedId.replace(/:/g, "")}`,
    [rawEmbedId],
  );

  useEffect(() => {
    if (!bookingConfig.embedEnabled || !bookingConfig.namespace) {
      return;
    }

    const namespace = bookingConfig.namespace;
    let isActive = true;

    async function initializeEmbed() {
      try {
        const cal = await loadCalEmbedScript();

        if (!isActive) {
          return;
        }

        cal.config = cal.config || {};
        cal.config.forwardQueryParams = true;
        cal("init", namespace, {
          origin: bookingConfig.origin,
        });

        const namespaceApi = cal.ns?.[namespace];

        if (!namespaceApi) {
          throw new Error("Cal namespace API was not initialized.");
        }

        namespaceApi("on", {
          action: "linkReady",
          callback: () => {
            if (!isActive) {
              return;
            }

            setErrorMessage(null);
            setIsReady(true);
          },
        });
        namespaceApi("on", {
          action: "linkFailed",
          callback: () => {
            if (!isActive) {
              return;
            }

            setErrorMessage(CAL_LINK_FAILED_MESSAGE);
            setIsReady(false);
          },
        });
        namespaceApi("on", {
          action: "bookingSuccessfulV2",
          callback: (event: CalEventPayload) => {
            if (!isActive) {
              return;
            }

            setBookingSuccess(event.detail?.data ?? {});
            setErrorMessage(null);
            setIsReady(true);
          },
        });
        namespaceApi("inline", {
          calLink: bookingConfig.calLink,
          elementOrSelector: `#${embedId}`,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("Cal embed initialization failed", {
          error:
            error instanceof Error
              ? { message: error.message, name: error.name }
              : { message: String(error), name: null },
        });
        setErrorMessage(CAL_LINK_FAILED_MESSAGE);
        setIsReady(false);
      }
    }

    void initializeEmbed();

    return () => {
      isActive = false;
    };
  }, [bookingConfig, embedId]);

  if (!bookingConfig.embedEnabled) {
    return (
      <div className="p-6 sm:p-7">
        <div className="rounded-[1.2rem] border border-dashed border-white/14 bg-black/18 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-white/52">
            Booking embed ready
          </p>
          <p className="mt-3 font-display text-[1.8rem] leading-none tracking-[-0.04em] text-white">
            Add `NEXT_PUBLIC_CAL_BOOKING_URL` to replace this fallback with the
            live scheduler.
          </p>
          <p className="mt-4 text-sm leading-6 text-white/68">
            The contact page still supports discovery-call requests by email
            until Cal.com is configured.
          </p>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    const formattedStartTime = formatBookingStartTime(bookingSuccess.startTime);

    return (
      <div className="p-6 sm:p-7" data-testid="cal-booking-success">
        <div className="rounded-[1.2rem] border border-primary/20 bg-primary/10 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-white/58">
            Discovery call booked
          </p>
          <h4 className="mt-3 font-display text-[2rem] leading-none tracking-[-0.04em] text-white">
            Your slot is confirmed.
          </h4>
          <p className="mt-4 text-sm leading-6 text-white/74">
            Cal.com has recorded the booking and should already be sending the
            confirmation details to your inbox.
          </p>
          {bookingSuccess.title ? (
            <p className="mt-5 text-sm leading-6 text-white/82">
              Session: {bookingSuccess.title}
            </p>
          ) : null}
          {formattedStartTime ? (
            <p className="text-sm leading-6 text-white/82">
              Starts: {formattedStartTime}
            </p>
          ) : null}
          <p className="mt-5 text-sm leading-6 text-white/74">
            If there is more project context to share before the call, you can
            still use the quote form on this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isReady && !errorMessage ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/18">
          <p className="rounded-full border border-white/12 bg-[#111311] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/62">
            Loading scheduler
          </p>
        </div>
      ) : null}

      <div
        id={embedId}
        data-testid="cal-booking-embed"
        aria-label="Discovery call booking"
        className="min-h-168 bg-white"
      />

      {errorMessage ? (
        <div className="border-t border-white/12 bg-black/18 px-6 py-4 text-sm leading-6 text-white/74">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
