# `incident-report`

Three-step form for reporting an incident in Gdańsk, next to a map of
incidents. There is no backend: everything lives in the browser's
localStorage.

## Purpose

- The map starts with three hard-coded, made-up incidents
  (`SEED_INCIDENTS` in `constants/seed.ts`).
- The form (`IncidentForm`) has three steps — description (category,
  severity, title, description), location (district or map click, address,
  date/time) and contact + summary (name, e-mail, optional phone, consent).
  Each step is validated with its own zod schema (`validateStep()` in
  `schemas.ts`) before moving on; the first invalid field gets focus.
- The draft and current step are persisted on every change (zustand
  `persist`, key `incident-report:v1`), so a refresh doesn't lose a
  half-filled form.
- Step 2 (location): while it's active, clicking the map drops the pin,
  fills the latitude/longitude fields and reverse-geocodes the point into
  the address field (`pickLocation` in `store.ts` → `/api/incident-report/geocode`
  → `reverseGeocode()` in `server/queries.ts` → OSM Nominatim, cached 24h
  per point, User-Agent set per Nominatim's usage policy; the route only
  accepts points inside `GDANSK_BOUNDS`). Everything stays editable by hand
  for keyboard/screen-reader users: coordinates are plain text fields
  (decimal comma accepted), the district select drops the pin at a
  district's center, and "Uzupełnij adres ze współrzędnych" runs the same
  lookup for typed coordinates. Lookup progress is announced via
  `role="status"`.
- Submitting (simulated `SUBMIT_DELAY_MS` latency) stores the report with
  status `new`, shows a success message with a reference number, and the
  map flies to the report, drawn as a pulsing fuchsia dot with a visible
  "NOWY INCYDENT" label (the pulse stops under `prefers-reduced-motion`).
- `IncidentList` under the map is its text equivalent.

The store uses `skipHydration`; `IncidentReportDashboard` rehydrates it
after mount so the server render and first client render agree.

## Public API (`index.ts`)

- `IncidentReportDashboard` — top-level client component.
- `useIncidentReportStore` — draft, step, submitted reports, address lookup.
- `incidentReportQueries.reverseGeocode()` (the address formatting it uses,
  `formatNominatimAddress()`, is internal: `utils/nominatim-address.ts`).
- `incidentReportSchema`, `validateStep`, `geocodeQuerySchema`.
- `SEED_INCIDENTS`.
- Types: `Incident`, `IncidentDraft`, `IncidentCategory`,
  `IncidentSeverity`, `IncidentStatus`.

## Owned routes

- `src/app/(dashboard)/formularz/page.tsx`
- `src/app/api/incident-report/geocode/route.ts`

## Dependencies

- `shared` only (`ui/button`, `ui/input`, `ui/card`, `ui/skeleton`).
- OSM Nominatim (reverse geocoding, no key).
- `leaflet` / `react-leaflet` for the map; marker styles in
  `src/app/globals.css` (`.incident-marker*`, `--incident-new`).
