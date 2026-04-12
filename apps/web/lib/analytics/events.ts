export type AnalyticsEventMap = {
  // ST-064: CTA tracking
  cta_click: { cta_id: string; placement: string; page_path: string };

  // ST-065: Form funnel tracking
  form_start: { form_id: string };
  form_step_complete: {
    budget_band?: string;
    form_id: string;
    from_step: number;
    service_interest?: string[];
    to_step: number;
    total_steps: number;
  };
  form_submit: {
    budget_band?: string;
    form_id: string;
    service_interest?: string[];
    timeline_band?: string;
  };
  booking_complete: {
    booking_title?: string | null;
    booking_uid?: string | null;
    provider: string;
    start_time?: string | null;
  };

  // ST-066: Content events
  newsletter_subscribe: { page_path: string; placement: string };
  case_study_view: { slug: string; title: string };

  // Existing events (migrated to typed wrapper, names preserved)
  admin_login_succeeded: { method: string };
  booking_created: {
    booking_surface?: unknown;
    booking_title: string | null;
    booking_uid: string | null;
    end_time: string | null;
    event_type_id?: unknown;
    start_time: string | null;
    status: string | null;
  };
  newsletter_confirmed: { page_path: string; placement: string };
  quote_request_submitted: {
    budget_band: string;
    lead_id: string;
    newsletter_opt_in: boolean;
    page_path: string;
    project_type?: string;
    services_interest: string[];
    timeline_band: string;
    utm_campaign: string | null | undefined;
    utm_medium: string | null | undefined;
    utm_source: string | null | undefined;
  };
};
