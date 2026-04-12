import "server-only";

import type { MirroredAnalyticsEventName } from "@/interfaces/analytics/mirror";
import {
  buildMirroredAnalyticsInsert,
  isMirroredAnalyticsEventName,
  sanitizeMirroredProperties,
} from "@/lib/analytics/mirror";
import { serverFeatureFlags } from "@/lib/env/server";
import { getPostHogClient } from "@/lib/posthog-server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

import type { AnalyticsEventMap } from "./events";

interface ServerAnalyticsContext {
  pagePath?: string | null;
  referrer?: string | null;
  sessionId?: string | null;
  userAgent?: string | null;
}

async function mirrorServerEvent<K extends keyof AnalyticsEventMap>(
  event: K,
  properties: AnalyticsEventMap[K],
  context?: ServerAnalyticsContext,
) {
  if (
    !serverFeatureFlags.serviceRoleEnabled ||
    !isMirroredAnalyticsEventName(event)
  ) {
    return;
  }

  const supabase = createServiceRoleSupabaseClient();
  const { error } = await supabase.from("events").insert(
    buildMirroredAnalyticsInsert(
      {
        eventName: event as MirroredAnalyticsEventName,
        pagePath: context?.pagePath ?? null,
        properties: sanitizeMirroredProperties(properties),
        referrer: context?.referrer ?? null,
        sessionId: context?.sessionId ?? null,
      },
      context?.userAgent ?? null,
    ),
  );

  if (error) {
    console.error("Server analytics mirror insert failed", {
      code: error.code,
      details: error.details,
      event,
      hint: error.hint,
      message: error.message,
    });
  }
}

export async function captureServerEvent<K extends keyof AnalyticsEventMap>(
  distinctId: string,
  event: K,
  properties: AnalyticsEventMap[K],
  context?: ServerAnalyticsContext,
): Promise<void> {
  getPostHogClient().capture({ distinctId, event, properties });
  await mirrorServerEvent(event, properties, context);
}
