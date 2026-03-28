import { createHmac, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import type { Database } from "@/lib/supabase/database.types";

const calWebhookSchema = z.object({
  createdAt: z.string().optional(),
  payload: z
    .object({
      endTime: z.string().nullish(),
      eventTypeId: z.number().nullish(),
      status: z.string().nullish(),
      startTime: z.string().nullish(),
      title: z.string().nullish(),
      uid: z.string().nullish(),
    })
    .passthrough(),
  triggerEvent: z.string(),
});

export interface CalWebhookEventProperties {
  bookingSurface: "contact-inline-embed";
  bookingUid: string | null;
  endTime: string | null;
  eventTitle: string | null;
  eventTypeId: number | null;
  provider: "cal.com";
  providerTrigger: "BOOKING_CREATED";
  startTime: string | null;
  status: string | null;
  webhookVersion: string | null;
}

function normalizeSignature(signature: string) {
  return signature.trim().replace(/^sha256=/i, "");
}

export function verifyCalWebhookSignature({
  payload,
  secret,
  signature,
}: {
  payload: string;
  secret: string;
  signature: string | null;
}) {
  if (!signature) {
    return false;
  }

  const normalizedSignature = normalizeSignature(signature);
  const expectedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (normalizedSignature.length !== expectedSignature.length) {
    return false;
  }

  return timingSafeEqual(
    Buffer.from(normalizedSignature),
    Buffer.from(expectedSignature),
  );
}

export function parseCalWebhookPayload(payload: string) {
  try {
    return calWebhookSchema.safeParse(JSON.parse(payload));
  } catch {
    return calWebhookSchema.safeParse(null);
  }
}

export function isSupportedCalTrigger(triggerEvent: string) {
  return triggerEvent === "BOOKING_CREATED";
}

export function buildCalBookingEventInsert({
  payload,
  userAgent,
  webhookVersion,
}: {
  payload: string;
  userAgent: string | null;
  webhookVersion: string | null;
}): Database["public"]["Tables"]["events"]["Insert"] | null {
  const parsedPayload = parseCalWebhookPayload(payload);

  if (!parsedPayload.success) {
    return null;
  }

  if (!isSupportedCalTrigger(parsedPayload.data.triggerEvent)) {
    return null;
  }

  const bookingProperties = {
    bookingSurface: "contact-inline-embed",
    bookingUid: parsedPayload.data.payload.uid ?? null,
    endTime: parsedPayload.data.payload.endTime ?? null,
    eventTitle: parsedPayload.data.payload.title ?? null,
    eventTypeId: parsedPayload.data.payload.eventTypeId ?? null,
    provider: "cal.com",
    providerTrigger: "BOOKING_CREATED",
    startTime: parsedPayload.data.payload.startTime ?? null,
    status: parsedPayload.data.payload.status ?? null,
    webhookVersion,
  } satisfies CalWebhookEventProperties;

  return {
    event_name: "booking_complete",
    page_path: "/contact",
    properties: bookingProperties,
    referrer: null,
    session_id: null,
    user_agent: userAgent,
  };
}
