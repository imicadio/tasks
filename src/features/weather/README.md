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

- `src/app/(dashboard)/pogoda/page.tsx`
- `src/app/api/weather/route.ts` — `GET ?q=&sort=&dir=`

## Depends on

`shared` only.

## Notes

Same IMGW type-inconsistency caveat as `hydro-monitor` applies to the synop
feed — see `docs/decisions/0003-api-data-validation.md`. Every numeric
field in `schemas.ts` goes through the shared `apiNullableNumber()` helper
rather than a plain `z.number()`.
