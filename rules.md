# Engineering Rules

## Web Architecture

- Components are presentational only. Business logic belongs in hooks, actions, helpers, or domain utilities.
- Export one component per file.
- Do not define nested render components inside component files.
- Shared exported interfaces and types live in `apps/web/interfaces/<group>/*`.
- Copy, constants, labels, and option lists live in `apps/web/constants/<group>/*`.
- Server actions and server-side queries use one exported action/query per file under `apps/web/actions/<group>/<name>.ts`.
- Database reads and writes for app domains belong in `apps/web/actions/*`, not in `apps/web/lib/*`.
- `apps/web/lib/*` is reserved for shared side-effect-free helpers, low-level platform clients, and narrowly scoped domain utilities.
- Do not keep compatibility shims or pass-through re-export files once imports have been migrated. Import from the canonical module directly.
- Prefer direct imports from `actions`, `constants`, and `interfaces` over legacy facade modules.
- Prefer direct leaf imports over barrels for actions.
- Follow SRP and KISS. Extract only when a responsibility becomes distinct or reuse is real.

## Canonical Folder Ownership

- `apps/web/actions/<domain>/*`: request orchestration, server actions, server-side queries, and domain helpers tied to app workflows.
- `apps/web/constants/<domain>/*`: static copy, labels, navigation config, option arrays, and fallback content datasets.
- `apps/web/interfaces/<domain>/*`: shared exported contracts, props, content models, and form or action state types.
- `apps/web/hooks/<domain>/*`: client-side stateful orchestration for UI features.
- `apps/web/lib/*`: pure helpers and low-level infrastructure only. Examples: formatting, text parsing, markdown transforms, Supabase client factories.

## Import Rules

- Pages should import data loaders and mutations from `apps/web/actions/*`.
- Components should import static copy and option data from `apps/web/constants/*`.
- Components, hooks, and actions should import shared contracts from `apps/web/interfaces/*`.
- Do not create `lib/content/*` style facades that simply re-export domain files from `actions`, `constants`, or `interfaces`.
- If a module contains both static config and lookup logic, split the config into `constants/*` and keep the logic in `lib/*` or `actions/*` as appropriate.

## File Size Guardrails

- Presentational component target: `<= 150` LOC. Review required above `250`.
- Hook/helper/action target: `<= 200` LOC. Review required above `300`.
- Page and route entrypoint target: `<= 120` LOC. Review required above `200`.

## Testing

- Hooks and server actions must have Vitest coverage.
- Run `lint`, `typecheck`, and relevant Vitest suites for touched areas before closing work.

## Migration Rule

- When refactoring toward the canonical structure, temporary adapters are acceptable only during the migration itself.
- Before closing the task, remove obsolete adapters and update consumers to the final canonical import paths.
