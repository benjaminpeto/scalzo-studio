"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

import type { BookingProviderConfig } from "@/lib/booking/config";

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

interface BookingSuccessEvent {
  detail?: {
    data?: BookingSuccessData;
  };
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
  const calLink = bookingConfig.calLink;

  useEffect(() => {
    if (!bookingConfig.embedEnabled || !bookingConfig.namespace) {
      return;
    }

    let isActive = true;
    let readyOrFailed = false;
    let loadTimeoutId: number | null = null;

    async function initializeEmbed() {
      try {
        const cal = await getCalApi({
          namespace: bookingConfig.namespace ?? undefined,
        });

        if (!isActive) {
          return;
        }

        cal("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
        });

        cal("on", {
          action: "linkReady",
          callback: () => {
            if (!isActive) {
              return;
            }

            readyOrFailed = true;
            setErrorMessage(null);
            setIsReady(true);
          },
        });

        cal("on", {
          action: "linkFailed",
          callback: () => {
            if (!isActive) {
              return;
            }

            readyOrFailed = true;
            setErrorMessage(CAL_LINK_FAILED_MESSAGE);
            setIsReady(false);
          },
        });

        cal("on", {
          action: "bookingSuccessfulV2",
          callback: (event: BookingSuccessEvent) => {
            if (!isActive) {
              return;
            }

            readyOrFailed = true;
            setBookingSuccess(event.detail?.data ?? {});
            setErrorMessage(null);
            setIsReady(true);
          },
        });

        loadTimeoutId = window.setTimeout(() => {
          if (!isActive || readyOrFailed) {
            return;
          }

          readyOrFailed = true;
          setErrorMessage(CAL_LINK_FAILED_MESSAGE);
          setIsReady(false);
        }, 12000);
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

      if (loadTimeoutId) {
        window.clearTimeout(loadTimeoutId);
      }
    };
  }, [bookingConfig.embedEnabled, bookingConfig.namespace]);

  if (!bookingConfig.embedEnabled || !calLink) {
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

      <Cal
        namespace={bookingConfig.namespace ?? undefined}
        calLink={calLink}
        calOrigin={bookingConfig.origin ?? undefined}
        config={{
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
        }}
        className="min-h-168 bg-white"
        data-testid="cal-booking-embed"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
      />

      {errorMessage ? (
        <div className="border-t border-white/12 bg-black/18 px-6 py-4 text-sm leading-6 text-white/74">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
