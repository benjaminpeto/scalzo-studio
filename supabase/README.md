# Supabase Workspace

This directory is the single home for database-oriented work in the repository.

## Directory purpose

- `migrations/`: SQL migrations and schema changes
- `seed/`: seed scripts or reference data needed for local/dev setup

Future Supabase auth, RLS, and schema changes should land here instead of being scattered through the app workspace.

## Current workflow

At the moment, the project is prepared for Supabase work but does not yet include a committed local CLI setup or generated project config.

Use this workflow until that lands:

1. Keep application env vars in `apps/web/.env.local`.
2. Add schema changes as SQL files under `supabase/migrations/`.
3. Add any repeatable bootstrap data under `supabase/seed/`.
4. Update app code, query helpers, and env docs together when Supabase requirements change.
5. Document any operational setup changes in the root README or deployment docs.

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

## When the local CLI setup is added

Once the repo includes committed Supabase CLI configuration, extend this directory with:

- project config
- local start/stop commands
- migration application steps
- seed execution steps
- branch or preview database guidance
