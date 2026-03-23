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
npm run supabase:admin:bootstrap:local -- you@example.com
npm run supabase:migration:new -- add_feature_name
npm run supabase:db:diff
npm run supabase:types:local
npm run supabase:types:linked
npm run supabase:stop
```

What they do:

- `supabase:start`: starts the local Postgres/Auth/Storage/Studio stack
- `supabase:status`: shows local URLs, anon key, service role key, and service endpoints
- `supabase:db:reset`: drops and recreates the local database from committed migrations, then runs configured seeds
- `supabase:admin:bootstrap:local -- <email>`: promotes the first signed-up local auth user into `public.admins`
- `supabase:migration:new -- <name>`: creates a new empty migration file
- `supabase:db:diff`: diffs the local database against the committed migrations
- `supabase:types:local`: regenerates [`database.types.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/database.types.ts) from the local database
- `supabase:types:linked`: regenerates [`database.types.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/database.types.ts) from the linked hosted database
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

App helper mapping:

- `createBrowserSupabaseClient()` uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `createServerSupabaseClient()` uses the same public values and carries request cookies for session-aware RLS access
- `createServiceRoleSupabaseClient()` uses `SUPABASE_SERVICE_ROLE_KEY` and is reserved for trusted server-only workflows
- `getCurrentUser()`, `getCurrentUserAdminState()`, and `isCurrentUserAdmin()` resolve the current request user/admin state without redirecting or mutating UI state

Admin auth flow:

- Password login is supported for existing admin auth users.
- Email magic-link login is supported with `shouldCreateUser: false`, so it does not create new auth users during sign-in.
- Magic-link and confirmation emails should redirect through `/auth/confirm`, which validates the token and then redirects to the sanitized `next` path.
- The canonical post-login destination is `/admin`, and the local redirect allow-list in [`config.toml`](/Users/benji/WORK/Projects/scalzo-studio/supabase/config.toml) includes `/admin`, `/auth/confirm`, and `/auth/update-password`. `/protected` is kept only as a compatibility alias.
- Non-admin accounts are signed back out after successful authentication and shown a deterministic admin-access error.
- Public self-service signup is disabled in local config and should stay disabled in the hosted project as well.
- The email auth provider itself remains enabled so pre-provisioned admin users can still use password and magic-link login.
- Admin auth users should be provisioned manually through Supabase Studio or other privileged operator tooling, then granted `public.admins` membership explicitly.

Type generation rules:

- Treat [`database.types.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/database.types.ts) as generated output from the Supabase CLI.
- Regenerate it after schema or auth-significant database changes.
- Prefer `supabase:types:local` while developing against the local stack and `supabase:types:linked` when you need the hosted source of truth.

Seed flow:

- Files under `supabase/seed/` are executed after migrations during `npm run supabase:db:reset`.
- Use numbered SQL files so seed execution order stays deterministic.
- Keep repeatable local/dev bootstrap data here. Initial admin bootstrap belongs to `ST-015`.

First admin bootstrap flow:

1. Start the local stack with `npm run supabase:start`.
2. Create the auth user through Supabase Studio Auth.
3. Run `npm run supabase:admin:bootstrap:local -- you@example.com`.
4. Sign in with that user and verify admin access in the `/admin` app shell.

Hosted project bootstrap flow:

1. Ensure the project is linked with `npx supabase link --project-ref <your-project-ref>`.
2. Create the auth user in the hosted project.
3. Run `npm run supabase:admin:bootstrap:linked -- you@example.com`.

Bootstrap safety rules:

- `bootstrap_first_admin` works only while `public.admins` is empty.
- It looks up the auth user by email and inserts exactly one initial admin record.
- The function is revoked from `anon`, `authenticated`, and `public`, so it must be executed from a privileged SQL/CLI context.

## App-side client boundaries

- Browser auth screens and interactive client components should use [`client.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/client.ts).
- Server components, route handlers, and server actions that should respect the signed-in user session should use [`server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/server.ts).
- Privileged backend-only jobs that intentionally bypass RLS should use [`service-role.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/service-role.ts).
- Shared request-level auth/admin lookups live in [`auth.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/auth.ts).

Auth orchestration boundaries:

- Route handlers and server actions should delegate multi-step auth flow logic to [`apps/web/actions/auth/server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/auth/server.ts).
- Client auth components should delegate browser Supabase calls to [`apps/web/actions/auth/client.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/auth/client.ts).
- Proxy/session orchestration should delegate to [`apps/web/actions/session/server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/session/server.ts).
- Admin route guards should delegate to [`apps/web/actions/admin/server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/admin/server.ts).
- Keep [`apps/web/lib/supabase/auth.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/auth.ts) focused on side-effect-free request/user/admin lookup helpers rather than redirects or UI flow control.
- Do not reintroduce direct Supabase client creation into auth route files or UI components when the action modules can own that orchestration.

Service-role usage rules:

- Keep service-role access server-only.
- Do not use service-role access for normal signed-in application reads or writes.
- Prefer RLS-enforced request-scoped access unless the workflow explicitly requires elevated privileges.

Hosted project workflow:

- Link a hosted project with `npx supabase link --project-ref <your-project-ref>`.
- Apply committed migrations to the linked project with `npm run supabase:db:push`.
- Include seed data in a remote push only when that is intentional:
  `npx supabase db push --linked --include-seed`.

## Storage bucket strategy

Storage buckets for public marketing content are managed by SQL migration so the setup is reproducible in local and hosted environments.

Buckets:

- `case-study-images`: public bucket for case study cover and gallery images
- `blog-images`: public bucket for blog cover images and editor-inserted post images

Upload path rules:

- `case-study-images`: `<slug>/cover/<filename>` and `<slug>/gallery/<filename>`
- `blog-images`: `<slug>/cover/<filename>` and `<slug>/content/<filename>`
- Slugs must be lowercase kebab-case.
- File names are normalized to lowercase ASCII-safe names and must end in `.avif`, `.jpg`, `.jpeg`, `.png`, or `.webp`.

Validation and access rules:

- Each bucket allows `image/avif`, `image/jpeg`, `image/png`, and `image/webp`.
- Each object is limited to `10485760` bytes (`10 MB`).
- Public reads are allowed only for valid objects inside those two buckets.
- Inserts, updates, and deletes are restricted to authenticated admins through `storage.objects` policies.

App-side helpers live in [`storage.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/lib/supabase/storage.ts) and provide:

- bucket IDs and validation constants
- object-path builders for case study and blog media
- upload validation helpers
- public and signed URL helpers for later editor flows

Verification steps:

1. Run `npm run supabase:db:reset`.
2. Confirm both bucket rows exist in `storage.buckets`.
3. Confirm public reads and admin-only writes are present in `pg_policies` for `storage.objects`.
4. Use the helper module to generate an object path and verify it matches the documented bucket/path contract.

## Current schema baseline

- Initial schema migration:
  [`20260322000100_initial_schema.sql`](/Users/benji/WORK/Projects/scalzo-studio/supabase/migrations/20260322000100_initial_schema.sql)
- First-admin bootstrap migration:
  [`20260323000100_bootstrap_first_admin.sql`](/Users/benji/WORK/Projects/scalzo-studio/supabase/migrations/20260323000100_bootstrap_first_admin.sql)
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
