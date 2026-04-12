import type {
  MirroredAnalyticsEventName,
  MirroredAnalyticsPayload,
} from "@/interfaces/analytics/mirror";
import { mirroredAnalyticsEventNames } from "@/interfaces/analytics/mirror";
import type { Json } from "@/lib/supabase/database.types";

export function isMirroredAnalyticsEventName(
  value: string,
): value is MirroredAnalyticsEventName {
  return mirroredAnalyticsEventNames.includes(
    value as MirroredAnalyticsEventName,
  );
}

function sanitizeMirroredValue(value: unknown): Json | undefined {
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "string"
  ) {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => sanitizeMirroredValue(entry))
      .filter(
        (entry): entry is NonNullable<typeof entry> => entry !== undefined,
      );
  }

  if (typeof value === "object") {
    const sanitizedEntries = Object.entries(value).reduce<Record<string, Json>>(
      (result, [key, entry]) => {
        const sanitizedEntry = sanitizeMirroredValue(entry);

        if (sanitizedEntry !== undefined) {
          result[key] = sanitizedEntry;
        }

        return result;
      },
      {},
    );

    return sanitizedEntries;
  }

  return undefined;
}

export function sanitizeMirroredProperties(value: unknown): Json | null {
  const sanitized = sanitizeMirroredValue(value);

  if (sanitized && typeof sanitized === "object" && !Array.isArray(sanitized)) {
    return sanitized;
  }

  return null;
}

export function buildMirroredAnalyticsInsert(
  payload: MirroredAnalyticsPayload,
  userAgent: string | null,
) {
  return {
    event_name: payload.eventName,
    page_path: payload.pagePath,
    properties: sanitizeMirroredProperties(payload.properties),
    referrer: payload.referrer,
    session_id: payload.sessionId,
    user_agent: userAgent,
  };
}
