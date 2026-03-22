# Scalzo Studio

Scalzo Studio is a conversion-focused marketing site and internal operations platform for a multidisciplinary design studio serving businesses in the Canary Islands and international clients.

## Workspace layout

```text
.
|-- apps/
|   `-- web/              # Next.js App Router application
|-- packages/
|   |-- config/           # Shared TypeScript and ESLint config
|   `-- ui/               # Shared UI primitives and utilities
|-- supabase/
|   |-- migrations/       # SQL migrations
|   `-- seed/             # Seed scripts or reference data
|-- .agents/              # Project planning and agent docs
```

## Scripts

Run all commands from the repository root:

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run format
npm run check
```

`npm run format` checks Prettier formatting. Use `npm run format:write` to apply formatting locally.

## Quality gates

- Pre-commit runs `lint-staged` through Husky.
- CI runs formatting, lint, typecheck, and build checks on pull requests and `main`.
- `npm run check` runs the full validation suite locally.

## Deployment

Vercel deployment setup, branch rules, preview environment guidance, and cache
header verification steps are documented in
[`docs/deployment/vercel.md`](/Users/benji/WORK/Projects/scalzo-studio/docs/deployment/vercel.md).

## Environment

The Next.js app now lives in [`apps/web`](/Users/benji/WORK/Projects/scalzo-studio/apps/web). Local environment files should live beside that app:

```bash
apps/web/.env.local
```

Expected variables at this stage:

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

Environment variables are validated at runtime through
[`public.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/env/public.ts)
and
[`server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/env/server.ts).
Public Supabase keys support either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or
the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Aliases

The workspace uses:

- `@/*` for `apps/web`
- `@ui/*` for `packages/ui/src`

These aliases are defined in [`apps/web/tsconfig.json`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/tsconfig.json) and mirrored at the root [`tsconfig.json`](/Users/benji/WORK/Projects/scalzo-studio/tsconfig.json) for editor tooling.

## Supabase

The [`supabase`](/Users/benji/WORK/Projects/scalzo-studio/supabase) directory is the home for local database configuration, migrations, and seed material. Initial structure is in place so future schema/auth tickets have a stable location to land in.
