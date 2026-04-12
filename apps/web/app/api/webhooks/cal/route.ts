import { NextRequest, NextResponse } from "next/server";

import {
  buildCalBookingEventInsert,
  parseCalWebhookPayload,
  verifyCalWebhookSignature,
} from "@/lib/booking/cal-webhook";
import { serverEnv, serverFeatureFlags } from "@/lib/env/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  if (!serverFeatureFlags.calWebhookEnabled) {
    console.error(
      "Cal webhook rejected because the integration is not configured",
    );

    return NextResponse.json(
      { ok: false, error: "Cal webhook is not configured." },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-cal-signature-256");

  if (
    !verifyCalWebhookSignature({
      payload: rawBody,
      secret: serverEnv.calWebhookSecret!,
      signature,
    })
  ) {
    console.error("Cal webhook rejected because the signature is invalid");

    return NextResponse.json(
      { ok: false, error: "Invalid signature." },
      { status: 401 },
    );
  }

  const parsedPayload = parseCalWebhookPayload(rawBody);

  if (!parsedPayload.success) {
    console.error("Cal webhook payload validation failed", {
      issues: parsedPayload.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join("."),
      })),
    });

    return NextResponse.json(
      { ok: false, error: "Invalid payload." },
      { status: 400 },
    );
  }

  if (parsedPayload.data.triggerEvent !== "BOOKING_CREATED") {
    return NextResponse.json({ ok: true, ignored: true }, { status: 202 });
  }

  const eventInsert = buildCalBookingEventInsert({
    payload: rawBody,
    userAgent: request.headers.get("user-agent"),
    webhookVersion: request.headers.get("x-cal-webhook-version"),
  });

  if (!eventInsert) {
    console.error("Cal webhook payload could not be normalized");

    return NextResponse.json(
      { ok: false, error: "Invalid booking payload." },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleSupabaseClient();
  const { error } = await supabase.from("events").insert(eventInsert);

  if (!error) {
    const props = eventInsert.properties as Record<string, unknown>;
    getPostHogClient().capture({
      distinctId: (props.bookingUid as string) ?? "booking-webhook",
      event: "booking_created",
      properties: {
        booking_uid: props.bookingUid ?? null,
        booking_title: props.eventTitle ?? null,
        start_time: props.startTime ?? null,
        end_time: props.endTime ?? null,
        status: props.status ?? null,
        event_type_id: props.eventTypeId ?? null,
        booking_surface: props.bookingSurface ?? null,
      },
    });
  }

  if (error) {
    console.error("Cal webhook event insert failed", {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
      triggerEvent: parsedPayload.data.triggerEvent,
    });

    return NextResponse.json(
      { ok: false, error: "Could not store event." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
