# Supabase Workspace

This directory is the single home for database-oriented work in the repository.

## Directory purpose

- `migrations/`: SQL migrations and schema changes
- `seed/`: seed scripts or reference data needed for local/dev setup

Future Supabase auth, RLS, and schema changes should land here instead of being scattered through the app workspace.

## Local CLI workflow

The repository now includes committed Supabase CLI configuration in
[`config.toml`](/Users/benji/WORK/Projects/scalzo-studio/supabase/config.toml)
and uses the root `npm` scripts as the primary local workflow.

Prerequisites:

- Docker Desktop or an equivalent Docker runtime
- `npm install` run from the repository root

Primary commands:

```bash
npm run supabase:start
npm run supabase:status
npm run supabase:db:reset
npm run supabase:migration:new -- add_feature_name
npm run supabase:db:diff
npm run supabase:types:local
npm run supabase:stop
```

What they do:

- `supabase:start`: starts the local Postgres/Auth/Storage/Studio stack
- `supabase:status`: shows local URLs, anon key, service role key, and service endpoints
- `supabase:db:reset`: drops and recreates the local database from committed migrations, then runs configured seeds
- `supabase:migration:new -- <name>`: creates a new empty migration file
- `supabase:db:diff`: diffs the local database against the committed migrations
- `supabase:types:local`: regenerates [`database.types.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/database.types.ts) from the local database
- `supabase:stop`: stops the local stack

Local app setup:

1. Start Supabase with `npm run supabase:start`.
2. Read the local URL and keys with `npm run supabase:status`.
3. Copy those values into `apps/web/.env.local`.
4. Run `npm run dev`.

If your local env file is already configured, you can use one command for the normal startup flow:

```bash
npm run dev:local
```

Env mapping for the web app:

- local API URL -> `NEXT_PUBLIC_SUPABASE_URL`
- local anon key -> `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- local service role key -> `SUPABASE_SERVICE_ROLE_KEY`

Seed flow:

- Files under `supabase/seed/` are executed after migrations during `npm run supabase:db:reset`.
- Use numbered SQL files so seed execution order stays deterministic.
- Keep repeatable local/dev bootstrap data here. Initial admin bootstrap belongs to `ST-015`.

Hosted project workflow:

- Link a hosted project with `npx supabase link --project-ref <your-project-ref>`.
- Apply committed migrations to the linked project with `npm run supabase:db:push`.
- Include seed data in a remote push only when that is intentional:
  `npx supabase db push --linked --include-seed`.

## Current schema baseline

- Initial schema migration:
  [`20260322000100_initial_schema.sql`](/Users/benji/WORK/Projects/scalzo-studio/supabase/migrations/20260322000100_initial_schema.sql)
- Source starter SQL from the project kit:
  [`supabase_schema.sql`](/Users/benji/WORK/Projects/scalzo-studio/.agents/project/supabase_schema.sql)
- App-side typed database contract:
  [`database.types.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/database.types.ts)

The initial migration mirrors the starter Supabase schema in the project kit and covers:

- content tables: `services`, `case_studies`, `posts`, `testimonials`
- operational tables: `admins`, `redirects`, `leads`, `events`
- helpers and automation: `is_admin()`, `set_updated_at()`, update triggers
- access control: published-content read policies plus admin-only CRUD policies under RLS

## Environment variables commonly involved

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

These are validated in:

- [`public.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/env/public.ts)
- [`server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/env/server.ts)

## Local service defaults

- Local Supabase Studio runs on `http://127.0.0.1:54323`
- Local API runs on `http://127.0.0.1:54321`
- Local database listens on port `54322`
- Seed files are loaded from `supabase/seed/*.sql`

Future follow-up work can still extend this setup with:

- branch or preview database guidance
- remote environment conventions
- generated type automation in CI
