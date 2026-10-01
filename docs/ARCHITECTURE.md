# Architecture: feature-based code organization

This document is the single source of truth for how code is organized in this
repo. Humans and Claude Code agents/skills (`feature-scaffolder`,
`architecture-reviewer`, `/create-feature`, `/feature-architecture-review`,
`/document-feature`) read this file rather than re-deriving or hardcoding the
pattern. If the pattern needs to change, change it here first.

## 1. Three-layer model

```
        depends on            depends on
  app ───────────────▶ features ───────────────▶ shared
   │                        │                        ▲
   │                        └────────────────────────┘
   └─────────────────────────────────────────────────▶ shared
```

- **`src/app/`** — routing only. Thin. Every `page.tsx`/`route.ts`/`layout.tsx`
  composes a feature's public API; it contains no business logic of its own.
- **`src/features/<name>/`** — product modules. Each feature owns its UI,
  data access, validation and domain types for one product concept
  (`billing`, `notifications`, `road-accidents`, ...).
- **`src/shared/`** — generic, product-agnostic code: design-system
  primitives, generic hooks/lib, cross-cutting types. Never contains a
  domain concept.

Dependency direction is one-way: `app → features → shared`. Nothing in
`shared/` may import from `features/` or `app/`, and nothing in `features/`
may import from `app/`.

## 2. `src/features/<feature>/` module contract

```
src/features/<feature>/
  index.ts                # REQUIRED — the ONLY file other layers may import from
  README.md               # REQUIRED — purpose, public exports, owned routes, dependencies
  types.ts                # domain types & DTOs
  schemas.ts               # zod schemas — shared by client forms, server actions, route handlers
  constants.ts             # optional: feature-local constants/enums
  store.ts                 # optional: client state — only if the feature needs cross-component client state
  components/
    <Feature>Overview.tsx  # top-level composable(s) exported via index.ts
    _internal/              # optional: private helper components, never exported
    __tests__/
  hooks/
    use-<feature>.ts
    __tests__/
  server/
    queries.ts              # server-only reads — starts with `import "server-only"`
    actions.ts               # server actions — starts with `"use server"` (if the feature has mutations)
    service.ts                # optional: framework-agnostic business logic reused by queries/actions
    __tests__/
```

A feature must have at least one of `components/` or `server/`. If it has
neither, it isn't a feature — it belongs in `shared/`.

Tests are colocated in `__tests__/` next to the code they test, not in a
top-level `tests/` tree, so a feature stays deletable/movable as one unit.

`server/queries.ts` starts with `import "server-only"` so an accidental
import from a Client Component fails the build instead of leaking
server-only code into the client bundle. `server/actions.ts` starts with
`"use server"`; Server Actions can be imported directly into Client
Components — no separate client-safe wrapper is needed.

### The `index.ts`-only rule

`index.ts` re-exports exactly the symbols other layers are allowed to use,
for example:

```ts
// src/features/notifications/index.ts
export { NotificationsOverview } from "./components/notifications-overview";
export { useNotifications } from "./hooks/use-notifications";
export * as notificationsQueries from "./server/queries";
export * as notificationsActions from "./server/actions";
export type { Notification, CreateNotificationInput } from "./types";
export { createNotificationSchema } from "./schemas";
```

Deep imports into another feature's internals
(`@/features/billing/server/queries` from outside `billing`) are forbidden.
Only the bare `@/features/billing` barrel may be imported. This makes every
cross-module dependency visible in one file per feature, lets internals be
refactored freely as long as the barrel's shape is preserved, and is what
makes the ESLint boundary rule in §4 mechanically enforceable.

## 3. `src/shared/`

```
src/shared/
  ui/          # design-system primitives: button.tsx, input.tsx, sidebar.tsx, card.tsx — no product concepts
  hooks/       # generic hooks: use-url-state.ts, use-debounced-value.ts, use-render-count.ts, use-mobile.ts
  lib/         # generic utilities: utils.ts (cn), api-validation.ts (apiNullableNumber)
  types/       # cross-cutting generic types: pagination.ts (Paginated<T>)
  providers/   # cross-cutting React context providers: app-providers.tsx (theme, React Query, tooltips)
  config/      # env var access wrapper (env.ts), site constants
```

`providers/` holds app-wide context providers mounted once in the root
layout (`src/app/layout.tsx`) — theme (`next-themes`), the React Query
`QueryClient`, tooltip context. Generic infrastructure, same "no product
concept" test as the rest of `shared/`.

**shadcn/ui** is configured (`components.json`) to install into this layer —
its aliases point `ui`/`components`/`lib`/`hooks` at `@/shared/*` instead of
the tool's own defaults (`@/components`, `@/lib`) — so `npx shadcn add
<component>` adds primitives here rather than creating a competing
top-level location. Don't hand-edit a shadcn-generated file's internals
beyond what `shadcn add`'s diff already changed; re-run `shadcn add
--overwrite` to update instead.

**Test for feature vs. shared**: does the code encode any product/domain
concept (a `User`, a `RoadAccident`, a business rule)? Yes → a feature. No,
it's generic infra or a dumb design-system primitive → `shared/`.

**Foundational features** (e.g. a future `auth`): a feature that many other
features depend on is still a *feature*, not `shared/`, if it has its own
UI/data/business rules. Such a feature must stay a leaf in the dependency
graph (it depends on no other feature) so cycles can't form. Document any
such exception here when it's introduced.

## 4. Boundary rules and enforcement

| From \ To | `app` | same `feature` internals | other `feature` (index only) | `shared` |
|---|---|---|---|---|
| `app` | forbidden (no cross-route private-folder imports) | n/a | allowed, index.ts only | allowed |
| `feature` | forbidden | allowed | allowed, index.ts only, minimize | allowed |
| `shared` | forbidden | forbidden | forbidden | allowed |

Enforced mechanically in `eslint.config.mjs` via `no-restricted-imports`,
scoped per directory with flat-config `files` overrides:

- Globally: `@/features/*/**` (any path-alias import reaching past a
  feature's own root, e.g. `@/features/billing/server/queries`) is
  forbidden — only the bare `@/features/<name>` barrel import is allowed.
  This works because code *inside* a feature imports its own files with
  relative paths (`./server/queries`), which this pattern doesn't match —
  only the `@/...` alias form is restricted.
- Globally: importing another route segment's private `_folder`
  (`@/app/**/_*/**`) is forbidden.
- Within `src/shared/**`: importing `@/features/**` or `@/app/**` is
  forbidden.
- Within `src/features/**`: importing `@/app/**` is forbidden.

Run `npm run lint` to check; the `architecture-reviewer` agent explains and
prioritizes violations found this way plus things ESLint can't model (e.g.
business logic leaking into `app/`, missing `index.ts`/tests) — ESLint
remains the authoritative mechanical check.

(An earlier draft of this document specified `eslint-plugin-boundaries` for
this job. It was dropped after implementation: its current major version's
policy syntax differs substantially from what's found in most write-ups of
it, and the plain `no-restricted-imports` approach above achieves the same
guarantees with zero extra dependencies.)

## 5. `app/` conventions

- Route groups (`(group)`) organize routes by section without affecting the
  URL, and can give a section its own root layout.
- Private folders (`_folder`) hold page-local, non-reusable, non-business
  cosmetic bits only. Anything reusable across ≥2 routes, or with business
  logic, belongs in `features/` or `shared/`.
- A `route.ts` delegates to `features/<feature>/server/`:

```ts
// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { notificationsQueries, notificationsActions } from "@/features/notifications";

export async function GET() {
  return NextResponse.json(await notificationsQueries.listNotifications());
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(await notificationsActions.createNotification(body), { status: 201 });
}
```

- A page composes a feature's top-level component:

```tsx
// src/app/(dashboard)/notifications/page.tsx
import { NotificationsOverview } from "@/features/notifications";

export default function NotificationsPage() {
  return <NotificationsOverview />;
}
```

## 6. Naming conventions

- Files/folders: kebab-case. Components: PascalCase exports.
- Feature folder names: singular product noun, kebab-case (`billing`,
  `road-accidents`).
- Tests: `*.test.ts(x)` inside a colocated `__tests__/`.

## 7. Testing conventions

Test runner: Vitest + React Testing Library. Per layer:
- `schemas.ts` — valid/invalid input cases.
- `server/queries.ts` / `server/actions.ts` — happy path + validation/error cases.
- `components/` — render + key interaction + `jest-axe`'s `toHaveNoViolations`
  (with the `color-contrast` rule disabled — jsdom doesn't do real
  layout/paint, so that one has to be verified live in a browser instead;
  see `docs/decisions/0005-accessibility.md`).
- `hooks/` — state transitions.

## 8. Next.js 16 caveats (read before touching data-fetching/caching/middleware)

This project runs Next.js **16.3.6**, which differs from older training-data
assumptions. Before writing data-fetching, caching, or middleware-equivalent
logic in any feature's `server/`, read:
`node_modules/next/dist/docs/01-app/02-guides/{caching-without-cache-components.md,migrating-to-cache-components.md,server-actions.md}`
and
`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/{middleware.md,proxy.md}`.
Not fully designed here — out of scope for this document.

## 9. Feature index

| Feature | Path | Purpose | Owned routes | Public exports | Depends on |
|---|---|---|---|---|---|
| `road-accidents` | `src/features/road-accidents/` | Dashboard of Polish road-accident statistics sourced from GUS BDL (`api.stat.gov.pl`) | `/road-accidents`, `/api/road-accidents` | `RoadAccidentsDashboard`, `useRoadAccidents`, `roadAccidentsQueries`, types/schemas | `shared` only |
| `hydro-monitor` | `src/features/hydro-monitor/` | Live river gauge station monitoring (water level vs. warning/alarm thresholds) from IMGW-PIB | `/hydrologia`, `/api/hydro-monitor` | `HydroMonitorDashboard`, `useHydroStations`, `useFavoriteStations`, `hydroMonitorQueries`, types/schemas | `shared` only |
| `weather` | `src/features/weather/` | Current weather conditions across IMGW synoptic stations | `/pogoda`, `/api/weather` | `WeatherDashboard`, `useWeatherStations`, `weatherQueries`, types/schemas | `shared` only |

Kept in sync by the `document-feature` skill/agent.

## 10. Change process

This document is the spec. Propose changes to the pattern here first; agents
must not silently deviate from it.

## 11. Related documents

- `docs/decisions/` — Architecture Decision Records for significant,
  hard-to-reverse choices (state architecture, API data validation, list
  rendering performance). See `docs/decisions/0001-record-architecture-decisions.md`
  for what belongs there.
- `docs/TECH_DEBT.md` — known shortcuts, why each was acceptable when made,
  and what would make it worth revisiting. Lighter-weight than an ADR;
  see that file's own intro for the distinction.
