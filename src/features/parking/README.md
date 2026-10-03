# `parking`

Gdańsk parking lots with live free-spot counts, shown on a map plus an
accessible table.

## Purpose

Data: ckan.multimediagdansk.pl (no API key), two feeds joined on
`id === parkingId` (`joinAvailability()` in `server/queries.ts`):

- Lot list (static-ish, cached 1h): `PARKING_LOTS_URL` in `constants.ts`.
- Live free spots (cached 30s, matching the source's own `Expires`):
  `PARKING_AVAILABILITY_URL` (`https://ckan3.multimediagdansk.pl/parkingLots`;
  ckan2 301-redirects there).

The client starts from the SSR snapshot and polls `/api/parking` every
`POLL_INTERVAL_MS` (60s).

### Stale readings

Some lots stop reporting for days but stay in the live feed with their last
value. Verified 2026-10-03: PGE Arena, AmberExpo, Forum Gdańsk and
Świętokrzyska all showed `0` with timestamps 4–15 days old. Presenting those
as "0 free" would claim the lot is full right now, so a reading older than
`STALE_AFTER_MS` (30 min) gets status `unknown`. The table still shows the
old count, explicitly labelled as not current. The map shows `?`. The status
is computed server-side at fetch time, so a `Date.now()` in render can't
cause a hydration mismatch.

### Status

The feed reports free spots only, not capacity, so the thresholds are
absolute counts: `0` → full, `< FEW_SPOTS_THRESHOLD` (20) → few, otherwise
available.

## Public API (`index.ts`)

- `ParkingDashboard` — top-level client component.
- `useParkingLots` — server-state hook (SSR `initialData`, polls every
  `POLL_INTERVAL_MS`).
- `parkingQueries.getParkingLots()`, `parkingQueries.joinAvailability()`,
  `parkingQueries.availabilityStatus()`.
- `GDANSK_CENTER`, `DEFAULT_ZOOM`, `POLL_INTERVAL_MS`.
- Types: `ParkingLot`, `ParkingLotId` (branded), `ParkingSnapshot`,
  `AvailabilityStatus`.

## Owned routes

- `src/app/(dashboard)/parkingi/page.tsx`
- `src/app/api/parking/route.ts` — `GET`

## Depends on

`shared` only. Marker styles (`.parking-marker*`) live in
`src/app/globals.css` next to the transit markers.

## Accessibility

See `docs/decisions/0005-accessibility.md`.

- **The table is the primary view.** It is a native `<table>` with a
  `<caption>`, `th scope="col"` headers and a `th scope="row"` per lot. Its
  horizontal-scroll wrapper is a focusable, labelled region. Each row has a
  "Pokaż na mapie: <name>" button that uses `aria-pressed` to show which lot
  is selected.
- **Status is never color-only (1.4.1).**
  - Map markers show the free-spot count as text, and the stale ones show
    `?`.
  - The table and legend show the status label next to the colored dot.
  - Stale markers also use a dashed border.
- **Map markers are keyboard-operable.** Leaflet renders them as
  `role="button"` with `tabindex="0"`. Each one has an sr-only accessible
  name (e.g. "P01 Galeria Bałtycka: 869 wolnych miejsc") and a visible
  `:focus-visible` outline.
- **Contrast.**
  - Marker text is `--chart-ink` on `--chart-surface`.
  - A dark outer ring keeps each pill distinguishable on light tiles
    (1.4.11).
- **Announcements are deliberately limited.** Per-minute number changes are
  not live-announced, because that would be noise. Only a refresh failure
  goes to a `role="status"` region.
