# Scalzo Studio

Scalzo Studio is a conversion-focused marketing site and internal operations platform for a multidisciplinary design studio serving businesses in the Canary Islands and international clients.

## Quick start

Prerequisites:

- Node.js `>=20.11.0`
- npm `11.7.0`

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
npm run build
npm run lint
npm run lint:fix
npm run typecheck
npm run test --workspace @scalzo/ui
npm run format
npm run format:write
npm run check
```

What they do:

- `npm run dev`: starts the Next.js app in `apps/web`
- `npm run build`: creates a production build
- `npm run lint`: runs workspace ESLint checks
- `npm run lint:fix`: applies ESLint autofixes
- `npm run typecheck`: runs TypeScript checks across workspaces
- `npm run test --workspace @scalzo/ui`: runs shared UI component tests
- `npm run format`: checks Prettier formatting
- `npm run format:write`: writes Prettier formatting changes
- `npm run check`: runs format, lint, typecheck, and build in sequence

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

Notes:

- Public Supabase auth supports either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Optional integrations like analytics, Resend, and Turnstile are validated only when configured.
- CI uses safe placeholder public envs for build-only validation.

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
