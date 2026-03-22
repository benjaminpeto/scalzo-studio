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
```

Current formatting is driven by ESLint autofixes. Prettier, Husky, lint-staged, and CI enforcement are scheduled for `ST-004`.

## Environment

The Next.js app now lives in [`apps/web`](/Users/benji/WORK/Projects/scalzo-studio/apps/web). Local environment files should live beside that app:

```bash
apps/web/.env.local
```

Expected variables at this stage:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Aliases

The workspace uses:

- `@/*` for `apps/web`
- `@ui/*` for `packages/ui/src`

These aliases are defined in [`apps/web/tsconfig.json`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/tsconfig.json) and mirrored at the root [`tsconfig.json`](/Users/benji/WORK/Projects/scalzo-studio/tsconfig.json) for editor tooling.

## Supabase

The [`supabase`](/Users/benji/WORK/Projects/scalzo-studio/supabase) directory is the home for local database configuration, migrations, and seed material. Initial structure is in place so future schema/auth tickets have a stable location to land in.
