import "server-only";

import { getPostHogClient } from "@/lib/posthog-server";

import type { AnalyticsEventMap } from "./events";

export function captureServerEvent<K extends keyof AnalyticsEventMap>(
  distinctId: string,
  event: K,
  properties: AnalyticsEventMap[K],
): void {
  getPostHogClient().capture({ distinctId, event, properties });
}
