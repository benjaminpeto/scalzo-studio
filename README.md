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
|       `-- actions/      # App-level orchestration for route handlers, server actions, and client auth flows
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
CONTACT_TO_EMAIL=
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
- `apps/web/lib/*` for low-level clients and side-effect-free helpers

Practical rule:

- Pages, route handlers, and UI components should stay thin and delegate multi-step auth or data-flow logic into action modules instead of importing Supabase clients directly.
- Apply the same rule to proxy/session and admin-route orchestration: keep `apps/web/proxy.ts` and `/admin` route files as integration shells that delegate into domain action modules.

## Route boundaries

- Public marketing pages stay in the `(marketing)` route group and remain anonymously accessible.
- Admin pages live under the internal `(admin)` route group while keeping the public URL surface at `/admin`.
- `/protected` remains a legacy alias that immediately redirects to `/admin`.
- The homepage at `/` is intentionally static and in-repo for now. CMS or loader boundary work for home content belongs to `ST-024`, not the current homepage route.

## Homepage content boundary

- The home route loads CMS-backed content for services, featured work, journal previews, and testimonials through `apps/web/lib/content/home.ts`.
- Hero, navigation/footer links, trust strip, process, studio credibility, FAQ, newsletter shell, and CTA band stay on static config for now.
- If the CMS tables are empty or unavailable, the loader falls back to the current in-repo home content so the page design and structure remain unchanged.

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
