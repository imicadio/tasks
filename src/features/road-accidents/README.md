# `road-accidents`

Dashboard of Polish road-accident statistics.

## Purpose

Shows the national trend (2000–2025) and the latest-year breakdown by
voivodeship for three metrics: accidents, fatalities, and injured. Data
comes from the public GUS "Bank Danych Lokalnych" (BDL) API
(`https://bdl.stat.gov.pl/api/v1`), subject `P1754` "Wypadki drogowe i ich
ofiary" — no API key required at this call volume.

## Public API (`index.ts`)

- `RoadAccidentsDashboard` — the top-level client component.
- `useRoadAccidents` — the hook managing metric/year filter state.
- `roadAccidentsQueries.getNationalTrend(metric, fromYear?, toYear?)` and
  `roadAccidentsQueries.getVoivodeshipBreakdown(metric, year?)`,
  `roadAccidentsQueries.getYearValue(metric, year?)` — server-only GUS BDL
  data access.
- `getRoadAccidentsPageData()` — the page's initial data (default metric's
  trend + breakdown, every metric's latest value) in one call.
- `trendQuerySchema`, `breakdownQuerySchema`, `metricSchema` — zod schemas
  used by `src/app/api/road-accidents/route.ts` to validate query params.
- `METRIC_LABELS`, `METRIC_COLORS`, `MIN_YEAR`, `MAX_YEAR` — display
  constants.
- Types: `Metric`, `YearDatum`, `VoivodeshipDatum`, `LatestByMetric`,
  `RoadAccidentsPageData`.

## Owned routes

- `src/app/(dashboard)/road-accidents/page.tsx` — the dashboard page.
- `src/app/api/road-accidents/route.ts` — `GET ?kind=trend&metric=&page=&pageSize=`
  and `GET ?kind=breakdown&metric=&year=`.

## Depends on

`shared` only (no other feature).

## GUS BDL integration notes

- BDL's numeric "level" is not a NUTS level: `0` = national "Polska"
  aggregate (unit id `000000000000`), `2` = voivodeship. Always query
  `unit-level=2` for voivodeship breakdowns — `unit-level=3` ("Region") is a
  different, finer split that doesn't line up 1:1 with voivodeships.
- Variable ids used: `7849` wypadki ogółem, `7850` ofiary śmiertelne, `7851`
  ranni (all unit `26`/`8`, verified live against the API).
- `page-size` max is 100; the 16 voivodeships fit in one page. The trend
  endpoint paginates over years for illustration (`page`/`pageSize` params),
  though the full 2000–2025 range is small enough to fetch in one call.
- Values observed so far all carry `attrId: 1` (clean) at the voivodeship
  level, but code should not assume this — see the `attrId` note in
  `docs/ARCHITECTURE.md` if this feature is extended to powiat/gmina level,
  where estimate/confidentiality flags are more common.
