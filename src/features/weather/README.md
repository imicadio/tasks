# `weather`

Current-conditions overview across Poland's IMGW synoptic weather stations.
Deliberately the lighter, secondary dashboard in this repo — `hydro-monitor`
is where the state-architecture/validation/performance practices are
demonstrated in depth (see its README and `docs/decisions/`); this feature
applies the same patterns (server state via React Query, URL state for
filters, the shared `apiNullableNumber` validation helper) at a smaller
scale to show they generalize, without repeating the same case study twice.

## Purpose

Data: IMGW-PIB public API, `https://danepubliczne.imgw.pl/api/data/synop`.
~60 stations, refreshed hourly.

## Public API (`index.ts`)

- `WeatherDashboard` — top-level client component.
- `useWeatherStations` — server-state hook.
- `weatherQueries.getWeatherStations()`, `weatherQueries.filterAndSortWeatherStations()`,
  `weatherQueries.summarizeWeather()`.
- `weatherQuerySchema`.
- Types: `WeatherStation`, `WeatherSortField`, `SortDirection`.

## Owned routes

- `src/app/(dashboard)/pogoda/page.tsx` — list, with each row linking to its
  station's detail page.
- `src/app/(dashboard)/pogoda/[id]/page.tsx` — single-station detail view,
  backed by IMGW's own per-station lookup endpoint
  (`/api/data/synop/id/{id}`, not just the list filtered down — a real
  404 for an unknown id, a single JSON object instead of an array, and
  every field returned as a string rather than the list endpoint's mix of
  numbers/strings; same `weatherStationSchema` handles both).
- `src/app/api/weather/route.ts` — `GET ?q=&sort=&dir=`
- `src/app/api/weather/[id]/route.ts` — `GET` → `{ data: WeatherStation }` or 404.

## Depends on

`shared` only.

## Notes

Same IMGW type-inconsistency caveat as `hydro-monitor` applies to the synop
feed — see `docs/decisions/0003-api-data-validation.md`. Every numeric
field in `schemas.ts` goes through the shared `apiNullableNumber()` helper
rather than a plain `z.number()`.
