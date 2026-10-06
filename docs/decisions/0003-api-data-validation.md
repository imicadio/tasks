# 0003: Validating and modeling third-party API data

## Status

Accepted

## Context

Interview feedback called out shallow answers on "modeling and validating
data from an API" specifically. It's tempting to treat that as a checkbox —
"we use Zod" — without engaging with what actually goes wrong in practice.
Building the hydro-monitor feature against IMGW's public hydrological API
(`https://danepubliczne.imgw.pl/api/data/hydro`) produced a real example
worth recording rather than a hypothetical one.

The first schema for this endpoint was written against a 5-record sample
fetched during research, where every numeric field (`id_stacji`, `lon`,
`lat`, `stan_wody`, `stan_ostrzegawczy`, `stan_alarmowy`) came back as a
proper JSON number. A schema built on `z.number()` for those fields passed
every manual check and the first ~900 records — then threw in production
(well, in `next dev`) at records 911–912 of a ~913-record array, where the
exact same fields came back as **numeric strings** (`"151140030"` instead
of `151140030`) for no field- or record-visible reason. The API is simply
not internally consistent about this, and no amount of testing against a
small sample would have caught it — the inconsistency only shows up deep in
the full array, on a live, changing feed.

## Decision

Treat every third-party API response as untrusted at the wire-format level,
not just at the "is this JSON" level:

1. **Never trust a field's declared type from a sample.** A numeric-looking
   field gets a coercing schema (`src/shared/utils/api-validation.ts`'s
   `apiNullableNumber()`), not a strict one, unless there's a documented
   contract guaranteeing the type (IMGW has no such contract).
2. **Anti-corruption layer.** Each feature's `schemas.ts` validates the raw
   wire shape (field names in the API's own language — `stacja`,
   `stan_wody`) and immediately `.transform()`s it into the feature's own
   domain type (`HydroStation`, in our own field names — `name`,
   `waterLevelCm`). Nothing outside `schemas.ts`/`types/` ever sees the
   raw IMGW shape again. This is what makes `deriveStationStatus()` (which
   turns three raw thresholds into one `StationStatus` the rest of the app
   reasons about) a pure, independently testable function rather than
   logic scattered through components.
3. **Null is data, not absence.** `stan_ostrzegawczy`/`stan_alarmowy` are
   genuinely nullable in the source data (not every gauge station has a
   configured warning/alarm level) — the domain type keeps them as
   `number | null` rather than coercing to 0, which would silently turn "no
   threshold configured" into "threshold is zero, so everything alarms."
4. **A validation failure is a thrown error at the API route boundary**,
   not a silently-empty array. `getHydroStations()` lets `zod`'s
   `ZodError` propagate; the route handler doesn't catch it. Given this
   feature is a live monitoring dashboard, showing an error is safer than
   showing a plausible-looking but wrong or partial number for a flood
   warning.

## Consequences

- One regression test (`src/features/hydro-monitor/__tests__/schemas.test.ts`)
  encodes the exact mixed-type shape observed live, so this specific class
  of bug can't silently come back.
- The coercion helper is shared (`src/shared/utils/api-validation.ts`) between
  `hydro-monitor` and `weather`, since the weather feature hits the same
  IMGW inconsistency on `/api/data/synop`. One helper, tested once, instead
  of copy-pasted per feature.
- Cost: every numeric field is one line longer to declare than a plain
  `z.number()`, and the preprocessing step means a genuinely malformed
  numeric field (e.g. `"twelve"`) is silently mapped to `null` rather than
  failing loudly. That's an intentional trade-off for a public feed with no
  SLA — see `docs/TECH_DEBT.md` for the follow-up this implies (surfacing
  *how many* fields got silently nulled, for observability, is not yet
  built).
- This is deliberately not "we validated the response" in the abstract — it's
  a specific bug, a specific fix, and a specific test, which is the level
  of concreteness the original feedback asked for.
