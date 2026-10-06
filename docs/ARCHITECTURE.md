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
  schemas.ts              # zod schemas — shared by client forms, server actions, route handlers
  store.ts                # optional: client state — only if the feature needs cross-component client state
  constants/              # every constant: URLs, labels, option lists, sizes, Intl formatters
    <topic>.ts            #   one file per topic (labels.ts, map.ts, sort.ts, ...)
    index.ts              #   barrel: `export * from "./<topic>"`
  types/                  # every type/interface except a component's own `Props`
    <topic>.ts
    index.ts
  utils/                  # every pure / standalone function: formatters, mappers, math, client fetchers
    <name>.ts             #   one function or one tight group of related functions per file
    index.ts              #   barrel — except client-only files (Leaflet etc.), imported directly
    __tests__/            #   REQUIRED for anything added here
  components/
    <feature>-dashboard.tsx # top-level composable(s) exported via index.ts
    _internal/            # sub-components, one per file, never exported via index.ts
    __tests__/
  hooks/
    use-<feature>.ts
    __tests__/
  server/
    queries.ts            # server-only reads — starts with `import "server-only"`
    page-data.ts          # optional: get<Feature>PageData() — everything a page needs, in one call
    actions.ts            # server actions — starts with `"use server"` (if the feature has mutations)
    __tests__/
```

`constants/index.ts` and `types/index.ts` re-export every topic file, so
code inside the feature imports `../constants` / `../types` and doesn't care
which topic file a name lives in. `utils/` is usually imported per file
(`../utils/format`) to keep each component's dependencies obvious.

A feature must have at least one of `components/` or `server/`. If it has
neither, it isn't a feature — it belongs in `shared/`.

Tests are colocated in `__tests__/` next to the code they test, not in a
top-level `tests/` tree, so a feature stays deletable/movable as one unit.

`server/queries.ts` starts with `import "server-only"` so an accidental
import from a Client Component fails the build instead of leaking
server-only code into the client bundle. `server/actions.ts` starts with
`"use server"`; Server Actions can be imported directly into Client
Components — no separate client-safe wrapper is needed.

### What goes where

The rule: **a file holds one kind of thing.** A component file holds a
component; constants, types and helpers each have their own folder.

| You're writing… | It goes in |
|---|---|
| A top-level `const` (URL, label map, option list, size, `Intl.*Format`, a value derived once from other constants) | `constants/<topic>.ts` |
| A `type` / `interface` used by more than one file, or describing domain data, API responses, store state, page data | `types/<topic>.ts` |
| A component's own `Props` type | **stays in the component file** — it's the component's contract |
| A pure function (formatting, mapping, counting, sorting, parsing, building ids/class lists) or a client-side `fetch` wrapper | `utils/<name>.ts` + a test in `utils/__tests__/` |
| A second component in the same file (`KpiRow`, `FlyTo`, a table, a marker) | its own file in `components/_internal/` |
| A `next/dynamic` lazy loader | `components/_internal/lazy-<name>.tsx` |
| Multi-step data assembly for a page (`Promise.all` over several queries, `Object.fromEntries`, `reduce` over results) | a named function in `server/page-data.ts` |
| Anything above that two or more features need | `src/shared/{constants,types,utils}/` |

So a component file contains imports, its `Props` type, the component, and
JSX. A hook file contains imports and the hook. Inline expressions inside
JSX are fine when they're trivial (`a ?? b`, a single ternary); anything
you'd want to name or test is a util.

**Pages and route handlers** follow the same rule from the `app/` side:
parse the input with the feature's schema (`firstValues` /
`requestSearchParams` from `@/shared/utils/search-params`), make **one**
call into the feature, render or return it. For example:

```tsx
// src/app/(dashboard)/road-accidents/page.tsx
export default async function RoadAccidentsPage() {
  const { trend, breakdown, latest } = await getRoadAccidentsPageData();
  return <RoadAccidentsDashboard initialTrend={trend} initialBreakdown={breakdown} initialLatest={latest} />;
}
```

Use Next's generated `PageProps<"/route">`, `LayoutProps<"/route">` and
`RouteContext<"/api/route">` for params instead of writing their shapes
inline.

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
  hooks/       # generic hooks: use-url-state.ts, use-debounced-value.ts, use-mobile.ts
  constants/   # generic constants: map.ts (OSM tiles, Gdańsk center/zoom), compass.ts
  types/       # cross-cutting generic types: pagination.ts (Paginated<T>), search-params.ts, nav.ts
  utils/       # generic utilities: cn.ts, api-validation.ts, search-params.ts, http.ts (badRequest),
               #   paginate.ts, escape-html.ts, compass.ts, wait.ts
  providers/   # cross-cutting React context providers: app-providers.tsx (theme, React Query, tooltips)
```

The "what goes where" rule from §2 applies here too. shadcn-generated
files (`ui/*` except `app-sidebar.tsx` and `theme-toggle.tsx`, and
`hooks/use-mobile.ts`) are exempt — they're regenerated by `shadcn add`,
not hand-edited.

`providers/` holds app-wide context providers mounted once in the root
layout (`src/app/layout.tsx`) — theme (`next-themes`), the React Query
`QueryClient`, tooltip context. Generic infrastructure, same "no product
concept" test as the rest of `shared/`.

**shadcn/ui** is configured (`components.json`) to install into this layer —
its aliases point `ui`/`components`/`lib`/`hooks` at `@/shared/*` (`lib` and `utils` at `@/shared/utils`) instead of
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
  cosmetic bits only — e.g. `(dashboard)/_constants/nav-items.tsx` (sidebar
  links) and `app/_constants/fonts.ts` (font loaders). Anything reusable
  across ≥2 routes, or with business logic, belongs in `features/` or
  `shared/`.
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
- `utils/` — every exported function, including edge cases (null input,
  empty lists, rounding boundaries).
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
| `road-accidents` | `src/features/road-accidents/` | Dashboard of Polish road-accident statistics sourced from GUS BDL (`api.stat.gov.pl`) | `/road-accidents`, `/api/road-accidents` | `RoadAccidentsDashboard`, `useRoadAccidents`, `roadAccidentsQueries`, `getRoadAccidentsPageData`, types/schemas | `shared` only |
| `hydro-monitor` | `src/features/hydro-monitor/` | Live river gauge station monitoring (water level vs. warning/alarm thresholds) from IMGW-PIB | `/hydrologia`, `/api/hydro-monitor` | `HydroMonitorDashboard`, `useHydroStations`, `useFavoriteStations`, `hydroMonitorQueries`, `getHydroPageData`, types/schemas | `shared` only |
| `weather` | `src/features/weather/` | Current weather conditions across IMGW synoptic stations | `/pogoda`, `/pogoda/[id]`, `/api/weather`, `/api/weather/[id]` | `WeatherDashboard`, `WeatherStationDetail`, `useWeatherStations`, `weatherQueries`, `getWeatherPageData`, types/schemas | `shared` only |
| `transit` | `src/features/transit/` | Live map of Gdańsk-area public transport vehicles (Tristar GPS feed) | `/transport`, `/api/transit` | `TransitDashboard`, `useVehiclePositions`, `transitQueries`, types/schemas | `shared` only |
| `parking` | `src/features/parking/` | Gdańsk parking lots with live free-spot counts (ckan.multimediagdansk.pl), on a map + accessible table | `/parkingi`, `/api/parking` | `ParkingDashboard`, `useParkingLots`, `parkingQueries`, types | `shared` only |
| `incident-report` | `src/features/incident-report/` | Three-step incident report form with a map of Gdańsk incidents (3 seeded + submitted ones), persisted to localStorage; map click reverse-geocodes the address (OSM Nominatim) | `/formularz`, `/api/incident-report/geocode` | `IncidentReportDashboard`, `useIncidentReportStore`, `incidentReportQueries`, `incidentReportSchema`, `geocodeQuerySchema`, `validateStep`, `SEED_INCIDENTS`, types | `shared` only |

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
