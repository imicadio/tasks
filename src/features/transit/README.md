# `transit`

Live map of Gdańsk-area public transport vehicles (trams and buses), with a
synchronized list.

## Purpose

Data: **Tristar** (the tri-city — Gdańsk/Sopot/Gdynia — public transport
system), via ZTM Gdańsk's public GPS feed,
`https://ckan2.multimediagdansk.pl/gpsPositions?v=2`. No API key required.
~200 vehicles reporting at any time, each refreshed by the source roughly
every 20s; a vehicle is dropped from the feed up to 5 minutes after its
last transmission. See the dataset listing at
`https://ckan.multimediagdansk.pl/dataset/tristar`.

## Public API (`index.ts`)

- `TransitDashboard` — top-level client component.
- `useVehiclePositions` — server-state hook (polls every
  `POLL_INTERVAL_MS`, currently 15s).
- `transitQueries.getVehiclePositions()`, `transitQueries.getVehiclesByRoute(route)`,
  `transitQueries.getRouteTypes()`. The pure helpers they use
  (`applyVehicleTypes`, `filterByRoute`) are internal: `utils/vehicles.ts`.
- `transitQuerySchema`.
- `GDANSK_CENTER`, `DEFAULT_ZOOM`, `POLL_INTERVAL_MS`.
- Types: `Vehicle`, `VehicleId` (branded), `VehicleType`, `Direction`,
  `VehiclesSnapshot`.

## Vehicle type (bus vs. tram vs. other)

Colored by real data, not guessed from the route number: ZTM Gdańsk's own
"Lista linii" resource (`TRISTAR_ROUTES_URL`) maps every `routeId` to a
`routeType` ("BUS"/"TRAM"/anything else). `getVehiclePositions()` fetches
both feeds in parallel and joins them
(`applyVehicleTypes` in `utils/vehicles.ts`, independently tested). Verified
live at the time this was built: every currently-active vehicle's `routeId`
resolved to `BUS` or `TRAM` — `"other"` is a real, handled case (a third
marker color and legend entry exist for it) but wasn't observed in
practice. The route list changes at most daily, so it's cached for an hour
— a different cache policy from the GPS feed itself, which is never
cached.

## Owned routes

- `src/app/(dashboard)/transport/page.tsx`
- `src/app/api/transit/route.ts` — `GET ?route=`

## Depends on

`shared` only.

## How the "driving" animation works

See `docs/decisions/0006-realtime-map-rendering.md` for the full decision
and trade-offs. Short version: positions are fetched every 15s, but each
vehicle's on-screen position is interpolated every animation frame (via
`requestAnimationFrame`) between its last two known fixes, so it appears to
move continuously rather than jumping every 15s. This interpolation is
**straight-line**, not snapped to actual streets — honest about being an
estimate between two real GPS readings, not a reconstruction of the
vehicle's real path.

Marker position updates bypass React state entirely
(`components/vehicle-markers-layer.tsx` talks to the underlying Leaflet
map instance directly via `useMap()` + imperative `marker.setLatLng()`).
With ~200 vehicles animating at 60fps, running that through React's render
cycle would mean ~200 component re-renders every ~16ms — the same class of
problem `hydro-monitor`'s performance case study
(`docs/decisions/0004-list-rendering-performance.md`) demonstrates, applied
here architecturally from the start rather than fixed after the fact.

## Accessibility

The map itself has one `aria-label` and is not the primary way to browse
vehicles by keyboard — map markers have `keyboard: false` deliberately
(200 individual tab-stops on a map would be worse than none). The
**vehicle list** alongside the map is the keyboard- and
screen-reader-accessible way to browse and select vehicles; selecting a
vehicle there also pans/zooms the map to it. This mirrors the approach in
`hydro-monitor` (a real, usable alternative alongside the visual widget,
not an afterthought) — see `docs/decisions/0005-accessibility.md`.

## Known limitations

- `direction` is reported by the source as one of 8 compass points
  (0/45/.../315°), not a continuous bearing — so the marker's arrow turns
  in 45° steps, not smoothly, even though the position tween is smooth.
- No historical trail/route-following — only the current interpolated
  position is shown, nothing about where a vehicle has been.
