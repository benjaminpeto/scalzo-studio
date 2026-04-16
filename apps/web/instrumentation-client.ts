import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  disable_session_recording: true,
  capture_dead_clicks: false,
  debug: process.env.NODE_ENV === "development",
  loaded: (ph) => {
    // Remote config may set captureDeadClicks:true — enforce local override after merge.
    ph.set_config({ capture_dead_clicks: false });
  },
});
