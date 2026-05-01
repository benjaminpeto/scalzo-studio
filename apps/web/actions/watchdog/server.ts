"use server";

import "server-only";

import type { Json } from "@/lib/supabase/database.types";
import { serverFeatureFlags } from "@/lib/env/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

export type WatchdogEventSource = "newsletter_signup" | "quote_request";
export type WatchdogEventStatus = "error" | "success";

interface WatchdogEventInput {
  context?: Record<string, unknown> | null;
  reason: string;
  source: WatchdogEventSource;
  status: WatchdogEventStatus;
}

function sanitizeWatchdogValue(value: unknown): Json | undefined {
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
      .map((entry) => sanitizeWatchdogValue(entry))
      .filter(
        (entry): entry is NonNullable<typeof entry> => entry !== undefined,
      );
  }

  if (typeof value === "object") {
    return Object.entries(value).reduce<Record<string, Json>>(
      (result, [key, entry]) => {
        const sanitizedEntry = sanitizeWatchdogValue(entry);

        if (sanitizedEntry !== undefined) {
          result[key] = sanitizedEntry;
        }

        return result;
      },
      {},
    );
  }

  return undefined;
}

function sanitizeWatchdogContext(value?: Record<string, unknown> | null): Json {
  const sanitized = sanitizeWatchdogValue(value ?? {});

  return sanitized && typeof sanitized === "object" && !Array.isArray(sanitized)
    ? sanitized
    : {};
}

export async function recordWatchdogEvent(
  input: WatchdogEventInput,
): Promise<void> {
  if (!serverFeatureFlags.serviceRoleEnabled) {
    return;
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { error } = await supabase.from("watchdog_events").insert({
      context: sanitizeWatchdogContext(input.context),
      reason: input.reason,
      source: input.source,
      status: input.status,
    });

    if (error) {
      console.error("Watchdog audit insert failed", {
        code: error.code,
        details: error.details,
        hint: error.hint,
        message: error.message,
        reason: input.reason,
        source: input.source,
        status: input.status,
      });
    }
  } catch (error) {
    console.error("Watchdog audit insert threw an unexpected error", {
      error:
        error instanceof Error
          ? { message: error.message, name: error.name }
          : { value: String(error) },
      reason: input.reason,
      source: input.source,
      status: input.status,
    });
  }
}
