<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Scalzo Studio's Next.js App Router application. Client-side analytics are initialized via `instrumentation-client.ts` (Next.js 15.3+ pattern) with EU hosting, automatic exception capture, and a reverse proxy to avoid ad-blockers. A shared server-side PostHog client (`lib/posthog-server.ts`) instruments critical server actions and API routes. Seven events are tracked across the full user journey — from quote form engagement through to confirmed newsletter subscribers and booked discovery calls — with user identification on admin login.

| Event                         | Description                                                                                               | File                                              |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `quote_request_step_advanced` | User advanced to the next step in the multi-step quote form (client-side funnel progression)              | `hooks/contact/use-quote-request-form.ts`         |
| `quote_request_submitted`     | Lead successfully saved to the database after form submission (server-side, critical conversion)          | `actions/contact/submit-quote-request.ts`         |
| `newsletter_signup_submitted` | User's newsletter signup form succeeded (client-side, confirmed by server action response)                | `components/newsletter/newsletter-signup.tsx`     |
| `newsletter_confirmed`        | Subscriber confirmed their email via confirmation link (server-side, subscriber activated in DB + Resend) | `actions/newsletter/confirm-newsletter-signup.ts` |
| `booking_created`             | Discovery call booking received and stored via Cal.com webhook (server-side, critical conversion)         | `app/api/webhooks/cal/route.ts`                   |
| `cal_booking_completed`       | User completed a booking via the inline Cal.com embed (client-side embed success callback)                | `components/contact/cal-booking-embed.tsx`        |
| `admin_login_succeeded`       | Admin signed in with password; PostHog user identified by email (client-side)                             | `hooks/auth/use-login-form.ts`                    |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/157877/dashboard/616975
- **Lead conversion funnel** (quote form step → submitted): https://eu.posthog.com/project/157877/insights/DpTow6JL
- **Leads & bookings over time** (daily quote requests + discovery calls): https://eu.posthog.com/project/157877/insights/7FeLjIpy
- **Newsletter signup to confirmation funnel** (submit → email confirmed): https://eu.posthog.com/project/157877/insights/9YtfoBOl
- **Quote form drop-off by step** (step advance volume broken down by step number): https://eu.posthog.com/project/157877/insights/Ir800ZAC
- **Newsletter signups by placement** (footer vs insights-detail vs homepage): https://eu.posthog.com/project/157877/insights/f2yDMnKi

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
