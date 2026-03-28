# Scalzo Studio

Scalzo Studio is a conversion-focused marketing site and internal operations platform for a multidisciplinary design studio serving businesses in the Canary Islands and international clients.

## Quick start

Prerequisites:

- Node.js `>=20.11.0`
- npm `11.7.0`
- Docker Desktop or an equivalent Docker runtime for local Supabase development

Install and run from the repository root:

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev
```

The site runs from [`apps/web`](/Users/benji/WORK/Projects/scalzo-studio/apps/web).

## Workspace layout

```text
.
|-- apps/
|   `-- web/              # Next.js App Router application
|       |-- actions/      # App-level orchestration, server actions, server-side queries, and domain helpers
|       |-- constants/    # Static copy, options, navigation config, and fallback content datasets
|       |-- interfaces/   # Shared exported contracts and state types
|       |-- hooks/        # Client-side orchestration for UI features
|       `-- lib/          # Low-level clients and side-effect-free shared helpers only
|-- packages/
|   |-- config/           # Shared TypeScript, ESLint, and workspace config
|   `-- ui/               # Shared UI primitives and utilities
|-- supabase/
|   |-- migrations/       # SQL migrations
|   `-- seed/             # Seed data and bootstrap scripts
|-- docs/
|   |-- deployment/       # Deployment and environment docs
|   `-- development/      # Local developer setup docs
|-- .agents/              # Planning and backlog source files
```

## Scripts

Run all commands from the repository root:

```bash
npm run dev
npm run dev:local
npm run build
npm run lint
npm run lint:fix
npm run typecheck
npm run test --workspace @scalzo/ui
npm run format
npm run format:write
npm run check
npm run supabase:start
npm run supabase:stop
npm run supabase:status
npm run supabase:db:reset
npm run supabase:admin:bootstrap:local -- you@example.com
npm run supabase:db:push
npm run supabase:migration:new -- add_feature_name
npm run supabase:types:local
npm run supabase:types:linked
```

What they do:

- `npm run dev`: starts the Next.js app in `apps/web`
- `npm run dev:local`: starts local Supabase first, then starts the Next.js app
- `npm run build`: creates a production build
- `npm run lint`: runs workspace ESLint checks
- `npm run lint:fix`: applies ESLint autofixes
- `npm run typecheck`: runs TypeScript checks across workspaces
- `npm run test --workspace @scalzo/ui`: runs shared UI component tests
- `npm run format`: checks Prettier formatting
- `npm run format:write`: writes Prettier formatting changes
- `npm run check`: runs format, lint, typecheck, and build in sequence
- `npm run supabase:start`: starts the local Supabase stack, including Studio
- `npm run supabase:stop`: stops the local Supabase stack
- `npm run supabase:status`: shows the local Supabase URLs and keys
- `npm run supabase:db:reset`: reapplies local migrations and seeds from scratch
- `npm run supabase:admin:bootstrap:local -- <email>`: promotes the first local auth user into the `admins` table
- `npm run supabase:db:push`: pushes committed migrations to the linked hosted Supabase project
- `npm run supabase:migration:new -- <name>`: creates a new migration file
- `npm run supabase:types:local`: regenerates app database types from the local database
- `npm run supabase:types:linked`: regenerates app database types from the linked hosted database

## Environment variables

Local environment files live beside the app:

```bash
apps/web/.env.local
```

Current variable contract:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_ANALYTICS_PROVIDER=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_NEWSLETTER_TOPIC_ID=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
TURNSTILE_SECRET_KEY=
```

Runtime validation is implemented in:

- [`public.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/env/public.ts)
- [`server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/env/server.ts)

The checked-in Supabase database contract lives in
[`database.types.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/database.types.ts)
and should be regenerated with the Supabase CLI instead of edited by hand.

Notes:

- Public Supabase auth supports either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Optional integrations like analytics, Resend, and Turnstile are validated only when configured.
- Contact notifications require `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`.
- Newsletter signup requires `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `RESEND_NEWSLETTER_TOPIC_ID`.
- Because the app currently uses one `RESEND_API_KEY` for both email sends and newsletter contact/topic sync, that Resend key must have `Full access`, not `Sending access`.
- CI uses safe placeholder public envs for build-only validation.

## Supabase client helpers

App-side Supabase access is split by execution context:

- [`client.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/client.ts): `createBrowserSupabaseClient()` for client components and browser auth flows
- [`server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/server.ts): `createServerSupabaseClient()` for request-scoped server components, route handlers, and server actions that should honor the current user session
- [`service-role.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/service-role.ts): `createServiceRoleSupabaseClient()` for privileged server-only workflows that intentionally bypass RLS
- [`auth.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/auth.ts): shared side-effect-free helpers such as `getCurrentUser()`, `getCurrentUserAdminState()`, and `isCurrentUserAdmin()`

Rules:

- Never import the service-role helper into client code.
- Prefer the request-scoped server helper for normal authenticated reads and writes so RLS continues to enforce access.
- Use the service-role helper only for trusted backend workflows such as privileged ingestion or administrative automation where bypassing RLS is intentional.

## App action convention

App-level orchestration should live in [`apps/web/actions/README.md`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/README.md).

Use these boundaries:

- `apps/web/actions/<domain>/server.ts` for route-handler and server-action orchestration
- `apps/web/actions/<domain>/client.ts` for browser-side orchestration that client components call
- `apps/web/actions/<domain>/<name>.ts` for individual exported queries and mutations
- `apps/web/constants/<domain>/*` for static content, options, labels, and fallback datasets
- `apps/web/interfaces/<domain>/*` for shared exported contracts
- `apps/web/lib/*` for low-level clients and side-effect-free shared helpers only

Practical rule:

- Pages, route handlers, and UI components should stay thin and delegate multi-step auth or data-flow logic into action modules instead of importing Supabase clients directly.
- Apply the same rule to proxy/session and admin-route orchestration: keep `apps/web/proxy.ts` and `/admin` route files as integration shells that delegate into domain action modules.
- Database reads and writes for app domains should not live in `apps/web/lib/*`.
- Do not keep facade modules that only re-export from `actions`, `constants`, or `interfaces`. Import from the canonical module directly.

## Route boundaries

- Public marketing pages stay in the `(marketing)` route group and remain anonymously accessible.
- Admin pages live under the internal `(admin)` route group while keeping the public URL surface at `/admin`.
- `/protected` remains a legacy alias that immediately redirects to `/admin`.
- The homepage at `/` is intentionally static and in-repo for now. CMS or loader boundary work for home content belongs to `ST-024`, not the current homepage route.

## Homepage content boundary

- The home route loads CMS-backed content for services, featured work, journal previews, and testimonials through `apps/web/actions/home/*`.
- Hero, navigation/footer links, trust strip, process, studio credibility, FAQ, and CTA band stay on static config for now.
- If the CMS tables are empty or unavailable, the loader falls back to the current in-repo home content so the page design and structure remain unchanged.

## Services index boundary

- `/services` loads the published services list from Supabase through `apps/web/actions/services/*`.
- The packages section, services FAQ, and CTA band are static for now.

## Service detail boundary

- `/services/[slug]` loads the published service row from Supabase through `apps/web/actions/services/*`.
- Problem framing, process/timeline, FAQ, and fallback related-work composition are completed with a static content layer when the CMS row does not yet provide everything needed.
- Service detail metadata prefers service-specific SEO fields from Supabase and falls back to the shared summary/problem framing.

## Work index boundary

- `/work` loads the published case-study grid from Supabase through `apps/web/actions/work/*`.
- The route falls back to the current in-repo featured-work content when the CMS table is empty or unavailable.

## Work detail boundary

- `/work/[slug]` loads the published case-study row from Supabase through `apps/web/actions/work/*`.
- Challenge, approach, testimonial, and visual composition fall back to a static case-study layer when the CMS row does not yet provide enough editorial detail on its own.
- Work detail metadata prefers case-study SEO fields from Supabase and otherwise falls back to the static route copy.
- When an admin explicitly enables preview mode, the same route can load the latest saved draft state for a case study without exposing a public shareable preview URL.

## Insights index boundary

- `/insights` loads the published posts index from Supabase through `apps/web/actions/insights/*`.
- The route supports a server-rendered `?tag=` filter for the tag UI and falls back to in-repo editorial entries when the `posts` table is empty or unavailable.
- Featured and supporting cards now route into the published article detail pages under `/insights/[slug]`.

## Insights detail boundary

- `/insights/[slug]` loads the published post row from Supabase through `apps/web/actions/insights/*`.
- Article body markdown is rendered safely without raw HTML support, with custom heading, link, and image rendering for the editorial article layout.
- If the CMS row is missing or incomplete, the route falls back to in-repo article content, image, and metadata helpers for the matching slug.
- When an admin explicitly enables preview mode, the same route can load the latest saved draft state for a post without exposing a public shareable preview URL.

## Newsletter boundary

- Newsletter signup runs through `apps/web/actions/newsletter/*` and is available from the homepage, insights index, insights detail pages, and the footer.
- The submit action stores a pending subscriber row through the Supabase service-role client, rotates a hashed confirmation token, and sends a Resend double opt-in email.
- `/newsletter/confirm` is the confirmation boundary. It validates the token, syncs the contact to the configured Resend topic, and marks the local subscriber row as confirmed only after provider sync succeeds.
- `/newsletter/confirmed` is a static in-repo route that renders the final confirmation, expired-link, invalid-link, or provider-error state.

## About page boundary

- `/about` is a static in-repo marketing route composed through `apps/web/constants/about/content.ts`.
- The capabilities section reuses the published services index loader from `apps/web/actions/services/*` and falls back to the in-repo service dataset when needed.
- The proof section reuses the published testimonials loader from `apps/web/actions/home/*` and falls back to the in-repo testimonial and trust-mark content when needed.

## Contact page boundary

- `/contact` is a static in-repo marketing route composed through `apps/web/constants/contact/content.ts`.
- `/contact/thank-you` is a static in-repo confirmation route that reuses the contact success and booking components for the post-submit handoff.
- Quote submissions run through the server action in `apps/web/actions/contact/server.ts`, which validates inputs and writes public lead records through the Supabase service-role client.
- The server action is the canonical lead-ingestion boundary for the quote form; no public client-side secret handling or direct browser database writes are part of the flow.
- The final quote-form step includes a newsletter opt-in checkbox that is checked by default but can be turned off before submit.
- Stored lead metadata includes `page_path`, `services_interest`, `budget_band`, `timeline_band`, and `source_utm` values such as `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, plus the fixed `submitted_via` marker.
- When Resend is configured, the same server action also sends an internal notification email plus a confirmation email to the lead. Lead persistence remains the primary success condition, so email delivery is best-effort and failures are logged without blocking the submission.
- When the quote-form newsletter checkbox stays enabled, the same server action also creates or refreshes a pending newsletter subscriber record and sends the normal double opt-in confirmation email. This newsletter sidecar remains best-effort and does not block lead success.
- The booking section supports an embedded provider URL when one is configured in content and otherwise falls back to a direct email route without adding a new environment contract yet.

## Newsletter verification

Use this checklist when validating the newsletter flow in local or preview:

- Confirm the environment includes `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `RESEND_NEWSLETTER_TOPIC_ID`.
- Submit the newsletter form from the homepage, insights index, insights detail, and footer, and verify each returns the check-your-inbox success state.
- Submit the quote form with the newsletter checkbox left on and verify it also creates a pending newsletter signup using the `contact` placement.
- Inspect the created `newsletter_subscribers` row and confirm it is stored as `pending` with the expected `placement`, `page_path`, token hash, and expiry values.
- Confirm the email link lands on `/newsletter/confirmed?status=confirmed` and the local subscriber row is updated to `confirmed`.
- Verify the confirmed contact appears in Resend under the configured newsletter topic.
- Confirm invalid or expired tokens land on the matching `/newsletter/confirmed` error states without exposing provider details.

## Contact form verification

Use this checklist when validating the current quote-request flow in local or preview:

- Confirm the environment includes a valid Supabase service-role key and the leads table is available for writes.
- Open `/contact` and verify the quote form renders as a four-step flow with Need, Context, Budget, and Brief steps.
- Happy path: complete all required fields, submit the form, and verify the success state replaces the form after the request is saved.
- Thank-you handoff: after a successful submission, verify the client redirects to `/contact/thank-you` and the page shows both the confirmation card and booking panel.
- Stored lead record: inspect the created `leads` row and confirm `page_path`, `services_interest`, `budget_band`, `timeline_band`, and `source_utm` were persisted from the submission.
- Resend happy path: with `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` configured, confirm one internal email lands in the studio inbox and one confirmation email lands in the submitter inbox.
- Client validation: attempt to continue or submit with required fields missing and verify the active step blocks progression and shows the relevant field errors.
- Server validation: submit an invalid payload through the server action path and verify the form returns the generic validation message plus field-level errors.
- Temporary outage: disable service-role access, submit a valid request, and verify the temporary-unavailable message is shown without exposing secrets or stack details.
- Failure observability: inspect the server logs for structured `console.error` entries on validation failures, disabled service-role mode, insert failures, and unexpected submission errors.
- Email outage: keep lead persistence enabled but break Resend delivery and verify the lead still saves, the form still returns success, and the log only includes lead id, page path, service/budget/timeline context, and email-kind metadata.
- Log hygiene: verify the error metadata includes only operational context such as page path, project type, budget/timeline bands, service selections, and boolean source flags, with no name, email, company, website, message, raw referrer, or raw UTM values.

## Admin auth verification

Use this checklist when validating the current admin auth UX:

- Anonymous visit to `/admin` redirects to `/auth/login?next=/admin`.
- Password sign-in for a provisioned admin lands on `/admin`.
- Magic-link sign-in for a provisioned admin lands on `/admin`.
- `next` redirect targets are preserved for admin routes.
- Authenticated non-admin users are signed out and returned to `/auth/login` with the access-denied message.
- Signing out from the admin shell returns to `/auth/login` with a success message.
- `/protected` still redirects to `/admin`.
- Public non-admin routes remain accessible without authentication.

## Admin content routes

- `/admin/services` is the current services management route for search, publish toggles, and ordering.
- `/admin/services/new` creates a new service entry through the admin editor.
- `/admin/services/[slug]` is the live services editor route for title, slug, markdown, deliverables, publish state, and SEO fields.
- `/admin/work` is the current case-studies management route for published-state filtering, industry filtering, preview access, and publish toggles.
- `/admin/work/new` creates a new case study entry through the admin editor.
- `/admin/work/[slug]` is the live case-study editor route for text content, metrics rows, publish state, and case-study image uploads.
- `/admin/insights` is the current posts management route for published-state filtering, tag filtering, preview access, and publish toggles.
- `/admin/insights/new` creates a new insight entry through the admin editor.
- `/admin/insights/[slug]` is the live insight editor route for markdown body editing, cover-image updates, content-image uploads, tag management, publish state, and SEO fields.
- Admin case-study preview mode is entered through `/api/preview/work?slug=<slug>` and exited through `/api/preview/disable`, both guarded by the current admin session.

## Quality gates

- Pre-commit runs `lint-staged` through Husky.
- CI runs formatting, lint, typecheck, and build checks on pull requests and `main`.
- `npm run check` is the local pre-merge validation command.

## Documentation

- Local setup and day-to-day development:
  [`docs/development/setup.md`](/Users/benji/WORK/Projects/scalzo-studio/docs/development/setup.md)
- Vercel project setup and deployment flow:
  [`docs/deployment/vercel.md`](/Users/benji/WORK/Projects/scalzo-studio/docs/deployment/vercel.md)
- Supabase directory usage and workflow:
  [`supabase/README.md`](/Users/benji/WORK/Projects/scalzo-studio/supabase/README.md)
