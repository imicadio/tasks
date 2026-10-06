# 0006: Real-time map rendering — imperative Leaflet, not React state, per frame

## Status

Accepted

## Context

`transit` shows ~200 vehicles whose positions should appear to move
continuously ("driving"), even though the source data only updates once
every `POLL_INTERVAL_MS` (15s). Two separate problems, easy to conflate:

1. **Smoothing a sparse update rate into continuous motion** — needs
   interpolation between two known points, re-evaluated every animation
   frame (~60 times/second).
2. **Rendering ~200 independently-moving map markers** without the
   per-frame work in (1) becoming a performance problem.

The naive approach — put each vehicle's current interpolated position in
React state, one `<Marker>` per vehicle from `react-leaflet` — fails on
(2): a `requestAnimationFrame` loop calling `setState` 60 times/second for
~200 markers means up to 12,000 component updates/second, almost all of
them recomputing a React tree whose only actual change is a `transform` on
a Leaflet-managed DOM node. This is the same class of mistake as the
`hydro-monitor` naive-mode demo in
`docs/decisions/0004-list-rendering-performance.md` — reusing React's
render cycle for something it was never meant to drive at animation-frame
rates — except here it's the default shape of the problem from the start,
not an anti-pattern someone has to introduce later.

## Decision

Split the work by what actually needs to be reactive:

- **React owns**: fetching data (`useVehiclePositions`, polling every 15s
  via TanStack Query — server state, per ADR 0002), the vehicle list, and
  filter/selection UI. These change at human-interaction or 15s-poll
  speed, where React's render cycle is exactly the right tool.
- **Leaflet owns, imperatively**: marker existence (create on first sight,
  remove when no longer reported) and marker position (`setLatLng` every
  animation frame). `components/vehicle-markers-layer.tsx` gets the raw
  Leaflet map instance via `useMap()` and manages a plain
  `Map<VehicleId, Marker>` in a ref — never in React state — so per-frame
  position updates never touch React's reconciler.

The interpolation itself (`utils/interpolate.ts`) is a small, pure,
independently-tested function (`interpolateLatLng`) — linear interpolation
between the vehicle's previous and current reported fix, parameterized by
elapsed time since the update landed. It is explicitly **not** map-matched
to roads: with only two sparse GPS points and no route geometry, snapping
to a plausible-looking street path would be fabricating data the source
never reported. A straight line between two real points is honest about
being an estimate; a road-snapped curve would look more convincing while
being less true.

Retargeting handles the case where a new update arrives before the
previous tween finished: the new animation starts from the marker's
*current interpolated position*, not from its last target, so updates
never cause a visible jump even if the poll interval and tween duration
drift out of sync.

## Consequences

- `VehicleMarkersLayer` renders `null` — it has no JSX output of its own;
  its entire job is the imperative side effect of driving Leaflet. This is
  an unusual-looking React component by normal conventions, worth the
  comment explaining why (and in this file).
- Markers are plain Leaflet `DivIcon`s styled with hand-written CSS
  (`.transit-marker` etc. in `globals.css`), not React-rendered icon
  components — because the whole point is that marker updates never go
  through React, a React-rendered icon would reintroduce the exact problem
  being avoided.
- `keyboard: false` on every marker is deliberate, not an oversight — see
  `docs/decisions/0005-accessibility.md` and this feature's README for the
  accessibility rationale (the list is the keyboard path, not the map).
- The map (`TransitMap`) is loaded via `next/dynamic` with `ssr: false` —
  Leaflet touches `window` at module-load time and cannot run during
  server rendering, unlike every other chart/visualization in this app
  (Recharts, which is SSR-safe).
- Cost of this approach: more code than a single `<Marker>`-per-vehicle
  loop would need, and a less typical/more surprising component shape.
  Worth it specifically because the vehicle count and frame rate make the
  naive approach a real, not theoretical, performance problem — this
  isn't premature optimization, it's sized to ~200 markers at 60fps from
  measurable first principles (12,000 potential state updates/sec), not
  speculation.
