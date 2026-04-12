import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import type { MirroredAnalyticsPayload } from "@/interfaces/analytics/mirror";
import {
  buildMirroredAnalyticsInsert,
  isMirroredAnalyticsEventName,
} from "@/lib/analytics/mirror";
import { serverFeatureFlags } from "@/lib/env/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

const mirroredAnalyticsPayloadSchema = z.object({
  eventName: z.string().refine(isMirroredAnalyticsEventName, {
    message: "Unsupported analytics event.",
  }),
  pagePath: z.string().trim().min(1).nullable(),
  properties: z.json().nullable(),
  referrer: z.string().trim().min(1).nullable(),
  sessionId: z.string().trim().min(1).nullable(),
});

function normalizePayload(
  payload: z.infer<typeof mirroredAnalyticsPayloadSchema>,
): MirroredAnalyticsPayload {
  return {
    eventName: payload.eventName,
    pagePath: payload.pagePath,
    properties: payload.properties,
    referrer: payload.referrer,
    sessionId: payload.sessionId,
  };
}

export async function POST(request: NextRequest) {
  if (!serverFeatureFlags.serviceRoleEnabled) {
    return NextResponse.json({ ok: true, skipped: true }, { status: 202 });
  }

  const parsedPayload = mirroredAnalyticsPayloadSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsedPayload.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid analytics payload." },
      { status: 400 },
    );
  }

  const supabase = createServiceRoleSupabaseClient();
  const { error } = await supabase
    .from("events")
    .insert(
      buildMirroredAnalyticsInsert(
        normalizePayload(parsedPayload.data),
        request.headers.get("user-agent"),
      ),
    );

  if (error) {
    console.error("Analytics mirror insert failed", {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
    });

    return NextResponse.json(
      { ok: false, error: "Could not store analytics event." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 202 });
}
