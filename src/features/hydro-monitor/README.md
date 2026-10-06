# `hydro-monitor`

Real-time-ish dashboard of Polish river gauge stations: current water level
vs. warning/alarm thresholds, derived into a per-station risk status.

## Purpose

This is the flagship feature of the repo — built specifically to
demonstrate the state-architecture, API-validation, and rendering-performance
practices described in `docs/decisions/0002-0004`. See those ADRs for the
full reasoning; this file covers what's actually in the box.

Data: **IMGW-PIB** ("Instytut Meteorologii i Gospodarki Wodnej –
Państwowy Instytut Badawczy") public data API,
`https://danepubliczne.imgw.pl/api/data/hydro`. No API key required at this
call volume. ~900 stations nationwide, refreshed roughly every 10-15
minutes by IMGW itself.

## Public API (`index.ts`)

- `HydroMonitorDashboard` — the top-level client component.
- `useHydroStations`, `useFavoriteStations` — server-state and global-state
  hooks.
- `hydroMonitorQueries` namespace: `hydroMonitorQueries.getHydroStations()`,
  `hydroMonitorQueries.filterAndSortStations()`.
- `getHydroPageData(params)` — the page's initial data in one call: the
  filtered list plus the voivodeship options and per-status counts
  (`utils/list-voivodeships.ts`, `utils/count-by-status.ts`).
- `hydroQuerySchema` — validates `src/app/api/hydro-monitor/route.ts`'s
  query params.
- `STATUS_LABELS`, `STATUS_COLORS`, `deriveStationStatus`, `toStationId`.
- Types: `HydroPageData`, `HydroStation`, `StationId` (branded), `StationStatus`,
  `StatusFilter`, `SortField`, `SortDirection`.

## Owned routes

- `src/app/(dashboard)/hydrologia/page.tsx`
- `src/app/api/hydro-monitor/route.ts` —
  `GET ?q=&status=&wojewodztwo=&sort=&dir=`

## Depends on

`shared` only.

## State architecture in this feature (see ADR 0002 for the general rule)

| State | Where | Why |
|---|---|---|
| Search input text (pre-debounce) | `useState` (local) | Must feel instant; not worth sharing before it settles |
| `status`, `voivodeship`, `sort`, `dir`, settled `q` | URL (`useUrlState`) | Shareable/bookmarkable filters — "alarm stations in pomorskie" is a link worth sending someone |
| Favorited station ids | Zustand + `persist` (global) | Crosses the filter bar and every row; should survive a reload |
| "Only favorites", hover, perf-demo mode | `useState` (local) | Session-only view preferences, not worth a link or persistence |
| The station list itself | TanStack Query (server) | Owned by IMGW; we cache/refetch it, we don't "own" it |

## Performance case study (see ADR 0004)

Flip **"Tryb naiwny (demo wydajności)"** above the station list. In
optimized mode, hovering a row re-renders exactly two rows (the row you
left, the row you entered). In naive mode, every mounted row re-renders on
any hover — because `StationRowUnmemoized` skips `React.memo` and receives
a freshly-created inline handler every render.

**To verify this yourself** (this is the actual point, not just reading
about it):
1. Open React DevTools → Profiler tab → start recording.
2. With "Tryb naiwny" **off**, hover across a few rows, stop recording.
   Look at the commit flamegraph: ~2 components per commit.
3. Start a new recording, flip **on** "Tryb naiwny", repeat the same hovers.
   Same interaction, dramatically wider flamegraph — every mounted row
   re-renders per commit.
4. Chrome DevTools' Performance panel tells the same story at the
   scripting/rendering level if you'd rather look there instead.

## IMGW integration notes

- BDL-style "level" hierarchies don't apply here — IMGW's hydro feed is
  flat, one record per station, no aggregation levels.
- **The response is not internally type-consistent.** See
  `docs/decisions/0003-api-data-validation.md` — some records return
  numeric fields as JSON numbers, others as numeric strings, deep in the
  same array. `src/shared/utils/api-validation.ts`'s `apiNullableNumber()`
  handles this; don't replace it with plain `z.number()`.
- `stan_ostrzegawczy` (warning level) and `stan_alarmowy` (alarm level) are
  genuinely absent (not zero) for many stations — not every gauge has a
  configured threshold. `deriveStationStatus` returns `"normal"` when
  thresholds are missing (nothing to compare against) and `"unknown"` only
  when the *current reading itself* is missing.
