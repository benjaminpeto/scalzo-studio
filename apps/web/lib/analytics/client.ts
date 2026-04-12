import posthog from "posthog-js";

import type { AnalyticsEventMap } from "./events";

export function captureEvent<K extends keyof AnalyticsEventMap>(
  event: K,
  properties: AnalyticsEventMap[K],
): void {
  posthog.capture(event, properties);
}
