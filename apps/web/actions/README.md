# App Action Modules

This directory is the single home for app-level action and orchestration code.

Use these boundaries:

- `apps/web/actions/<domain>/server.ts`: request-scoped server orchestration for route handlers and server actions
- `apps/web/actions/<domain>/client.ts`: browser-side orchestration for client components
- `apps/web/lib/supabase/*`: low-level Supabase client factories plus side-effect-free data helpers

Rules:

- Pages, route handlers, and components should delegate auth or data-flow orchestration into `apps/web/actions/*` modules.
- UI components should not import Supabase client factories directly when an action module can own that logic.
- Keep redirect decisions, sign-in/sign-out flows, OTP exchange, and multi-step auth checks in action modules.
- Keep reusable data lookup helpers in `apps/web/lib/*` free of UI redirects and presentational concerns.

Current auth example:

- [`apps/web/app/auth/confirm/route.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/app/auth/confirm/route.ts) parses the request and delegates to [`apps/web/actions/auth/server.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/auth/server.ts)
- [`apps/web/components/login-form.tsx`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/components/login-form.tsx), [`apps/web/components/forgot-password-form.tsx`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/components/forgot-password-form.tsx), [`apps/web/components/update-password-form.tsx`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/components/update-password-form.tsx), and [`apps/web/components/logout-button.tsx`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/components/logout-button.tsx) delegate browser auth flows to [`apps/web/actions/auth/client.ts`](/Users/benji/WORK/Projects/scalzo-studio/apps/web/actions/auth/client.ts)
