import posthog from "posthog-js";

import type { MirroredAnalyticsPayload } from "@/interfaces/analytics/mirror";
import {
  isMirroredAnalyticsEventName,
  sanitizeMirroredProperties,
} from "@/lib/analytics/mirror";

import type { AnalyticsEventMap } from "./events";

function resolvePagePath(properties: Record<string, unknown>) {
  const pagePath = properties.page_path;

  return typeof pagePath === "string" && pagePath ? pagePath : null;
}

function resolveSessionId() {
  const sessionId = posthog.get_session_id();

  return typeof sessionId === "string" && sessionId ? sessionId : null;
}

function mirrorEvent(payload: MirroredAnalyticsPayload) {
  void fetch("/api/analytics/events", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
    },
    keepalive: true,
    method: "POST",
  }).catch(() => {
    // Ignore mirror failures so analytics never blocks the user flow.
  });
}

export function captureEvent<K extends keyof AnalyticsEventMap>(
  event: K,
  properties: AnalyticsEventMap[K],
): void {
  posthog.capture(event, properties);

  if (isMirroredAnalyticsEventName(event)) {
    mirrorEvent({
      eventName: event,
      pagePath:
        resolvePagePath(properties as Record<string, unknown>) ??
        window.location.pathname,
      properties: sanitizeMirroredProperties(properties),
      referrer: document.referrer || null,
      sessionId: resolveSessionId(),
    });
  }
}

export function capturePageView(pagePath: string): void {
  mirrorEvent({
    eventName: "page_view",
    pagePath,
    properties: null,
    referrer: document.referrer || null,
    sessionId: resolveSessionId(),
  });
}
