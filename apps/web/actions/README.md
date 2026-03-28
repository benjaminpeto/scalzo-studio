# App Action Modules

This directory is the single home for app-level action and orchestration code.

Canonical ownership:

- `apps/web/actions/<domain>/*`: request-scoped server orchestration, server actions, server-side queries, and domain helpers
- `apps/web/actions/<domain>/server.ts`: optional thin compatibility or route-facing surface when a domain needs one
- `apps/web/actions/<domain>/client.ts`: browser-side orchestration for client components
- `apps/web/constants/<domain>/*`: static copy, options, fallback datasets, and navigation config
- `apps/web/interfaces/<domain>/*`: exported contracts and state types
- `apps/web/lib/*`: low-level clients and side-effect-free shared utilities only

Rules:

- Pages, route handlers, and components should delegate auth or data-flow orchestration into `apps/web/actions/*` modules.
- UI components should not import Supabase client factories directly when an action module can own that logic.
- Keep redirect decisions, sign-in/sign-out flows, OTP exchange, and multi-step auth checks in action modules.
- Keep reusable low-level helpers in `apps/web/lib/*` free of redirects, DB orchestration, and presentational concerns.
- Database reads and writes for app domains should not live in `apps/web/lib/*`.
- Prefer one exported action or query per file such as `apps/web/actions/<domain>/<name>.ts`.
- Prefer direct leaf imports from action files instead of routing new code through facade modules.
- Do not keep pass-through compatibility files once imports have been migrated.

Recommended domain layout:

```text
apps/web/actions/<domain>/
|-- <action-name>.ts
|-- <query-name>.ts
|-- helpers.ts
|-- schemas.ts
|-- server.ts        # optional thin compatibility surface
`-- client.ts        # optional browser orchestration
```

Current auth example:

- [`apps/web/app/auth/confirm/route.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/app/auth/confirm/route.ts) parses the request and delegates to [`apps/web/actions/auth/server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/auth/server.ts)
- [`apps/web/components/login-form.tsx`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/components/login-form.tsx), [`apps/web/components/forgot-password-form.tsx`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/components/forgot-password-form.tsx), [`apps/web/components/update-password-form.tsx`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/components/update-password-form.tsx), and [`apps/web/components/logout-button.tsx`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/components/logout-button.tsx) delegate browser auth flows to [`apps/web/actions/auth/client.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/auth/client.ts)

Current admin/session example:

- [`apps/web/proxy.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/proxy.ts) delegates request/session orchestration to [`apps/web/actions/session/server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/session/server.ts)
- [`apps/web/app/(admin)/admin/page.tsx`](</Users/benji/WORK/Projects/scalzo-studio/apps/web/app/(admin)/admin/page.tsx>) and [`apps/web/app/(admin)/admin/layout.tsx`](</Users/benji/WORK/Projects/scalzo-studio/apps/web/app/(admin)/admin/layout.tsx>) delegate admin-route access control and shell composition to [`apps/web/actions/admin/server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/admin/server.ts) plus dedicated admin UI components

Current public-content example:

- Public marketing route data lives in domain action folders such as [`apps/web/actions/home`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/home), [`apps/web/actions/services`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/services), [`apps/web/actions/work`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/work), and [`apps/web/actions/insights`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/insights)
- Static fallback datasets and page copy for those domains live in matching `constants/*` folders, with contracts in `interfaces/*`
