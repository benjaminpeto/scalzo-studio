# Development Setup

This guide covers the current local development workflow for the Scalzo Studio monorepo.

## Requirements

- Node.js `>=20.11.0`
- npm `11.7.0`
- Docker Desktop or an equivalent Docker runtime if you want to run Supabase locally

The repository pins npm through the root [`package.json`](/Users/benji/WORK/Projects/scalzo-studio/package.json) `packageManager` field.

## Initial setup

From the repository root:

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
npm run dev:local
npm run supabase:status
```

Then copy the local Supabase URL and keys from `npm run supabase:status` into
[`apps/web/.env.local`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/.env.local),
and add real values for any optional integrations you need locally.

## Running the app

Use:

```bash
npm run dev
npm run dev:local
npm run dev:local:stop
```

The root script delegates to the `@scalzo/web` workspace and starts the Next.js App Router app in [`apps/web`](/Users/benji/WORK/Projects/scalzo-studio/apps/web).
`npm run dev:local` starts Supabase, syncs the live local Supabase URL and keys into the tracked `.env.local` files, launches the web app, and keeps the Next.js server logs attached to that terminal.
Use `npm run dev:local:stop` to stop both the Next.js and Supabase local processes from any terminal.

## Validation commands

Use these from the repository root:

- `npm run lint`
- `npm run typecheck`
- `npm run test --workspace @scalzo/ui`
- `npm run format`
- `npm run build`
- `npm run check`

`npm run check` is the best pre-commit or pre-PR validation command when you want the full pass.

## Workspace notes

- `apps/web`: Next.js app
- `packages/ui`: shared UI primitives
- `packages/config`: shared config files
- `supabase`: SQL migrations and seed assets

Path aliases:

- `@/*` maps to `apps/web`
- `@ui/*` maps to `packages/ui/src`

## Environment behavior

Environment validation is strict by design.

- Missing required public variables fail fast during build and app startup.
- Optional server-only integrations are allowed to stay unset until those features are implemented.
- GitHub Actions injects safe placeholder public envs so CI can validate production builds without real secrets.
- Cal.com booking is optional in local development; when enabled it uses `NEXT_PUBLIC_CAL_BOOKING_URL` and `CAL_WEBHOOK_SECRET`.

## Legal content notes

- The `/privacy` and `/cookies` pages describe the current live site plus clearly labelled near-term services that are not yet active.
- PostHog must not be enabled in production until a separate consent and cookie-preferences implementation exists.
- Policy copy currently assumes hCaptcha as the future anti-spam provider. If production uses a different provider, update the legal content before launch.
- Cal.com booking setup and webhook verification steps live in [`docs/integrations/cal-com.md`](/Users/benji/WORK/Projects/scalzo-studio/docs/integrations/cal-com.md).

## Pre-commit hooks

Husky is enabled for this repository.

- Pre-commit runs `lint-staged`
- Staged app and UI files are linted and formatted before commit

If hooks stop working, run:

```bash
npm run prepare
```

## Deployment flow

The deployment setup lives in [`docs/deployment/vercel.md`](/Users/benji/WORK/Projects/scalzo-studio/docs/deployment/vercel.md).

Short version:

1. Open a feature branch.
2. Push changes and review the Preview Deployment.
3. Run `npm run check` locally before merge.
4. Merge to `main` for production deployment.

## Supabase workflow

Supabase-specific file placement and workflow guidance lives in [`supabase/README.md`](/Users/benji/WORK/Projects/scalzo-studio/supabase/README.md).

Common local commands from the repository root:

```bash
npm run supabase:start
npm run supabase:status
npm run supabase:db:reset
npm run supabase:admin:bootstrap:local -- you@example.com
npm run supabase:types:local
```

Typical local cycle:

1. Start both local servers with `npm run dev:local`.
2. Copy the local Supabase URL and keys from `npm run supabase:status` into `apps/web/.env.local` if you need them outside the combined startup flow. `npm run dev:local` will sync the main Supabase URL and keys automatically before Next starts.
3. Run `npm run supabase:db:reset` whenever you want to replay migrations and seeds deterministically.
4. Create your first auth user, then promote it with `npm run supabase:admin:bootstrap:local -- you@example.com`.
5. After schema changes, regenerate app types with `npm run supabase:types:local`.
6. Stop both local servers with `npm run dev:local:stop`, or use `Ctrl+C` in the terminal running `npm run dev:local`.
