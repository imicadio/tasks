# 0004: List rendering performance — memoization and virtualization

## Status

Accepted

## Context

Interview feedback specifically flagged a lack of hands-on experience with
profiling tools (React DevTools Profiler, browser performance panels) and
with identifying and fixing unnecessary re-renders architecturally, as
opposed to describing the concepts abstractly. The hydro-monitor feature's
station list (~900 rows from IMGW, rendered as a table with search, sort,
favorite-toggling, and hover highlighting) is a natural, honest place to
build and demonstrate this rather than construct an artificial example.

## Decision

Two independent optimizations, both real and both toggleable live in the
running app (`src/features/hydro-monitor/components/hydro-monitor-dashboard.tsx`,
the "Tryb naiwny" switch):

1. **Row memoization.** `StationRow` (`components/station-row.tsx`) is
   wrapped in `React.memo`. The dashboard passes it a `station` object that
   only changes identity when its own data actually changes (not on every
   parent render — it comes from the React Query cache, not from an inline
   object literal), and stable callbacks (`onHover`, `onToggleFavorite`)
   produced by `useCallback` with empty/stable dependency arrays. The
   result: hovering row A only re-renders row A (to highlight it) and row B
   (the previously-hovered row, to un-highlight it) — not the other ~900
   rows, even though the hover state lives in the parent and every row
   theoretically re-renders when the parent re-renders.
2. **Virtualization.** `@tanstack/react-virtual`'s `useVirtualizer` renders
   only the ~15-20 rows currently scrolled into view (plus a small
   overscan buffer) instead of ~900 DOM nodes, absolutely positioned inside
   a spacer element sized to the full virtual list height.

A same-file naive/optimized toggle exists specifically so this isn't a
claimed optimization but a **demonstrated** one: flipping "Tryb naiwny"
swaps in `StationRowUnmemoized` — the identical component body, minus the
`memo()` wrapper — fed by inline arrow-function handlers created fresh on
every render, with virtualization also disabled (all ~900 rows mounted
directly). Every row carries a live render counter
(`src/shared/hooks/use-render-count.ts`) visible on screen. Hovering a
single row in optimized mode moves the counter on exactly two rows; the
same action in naive mode moves every visible row's counter simultaneously
— reproducible in this repo without needing a canned screen recording, and
exactly what React DevTools Profiler's flamegraph or Chrome's Performance
panel would show as "commit re-rendered N components" vs. "commit
re-rendered 2 components."

## Consequences

- Verifying this claim yourself (not just trusting the README) is the
  point: open React DevTools' Profiler tab, start recording, hover a few
  rows in optimized mode, stop, look at the flamegraph — then repeat in
  naive mode. The row-count badges give an immediate visual signal even
  without the Profiler open; the Profiler gives the authoritative one.
- Virtualization means row height must stay fixed (`ROW_HEIGHT = 56`,
  `h-14` in the row's own class) — a variable-height row (e.g. wrapping
  long station names onto two lines) would need `useVirtualizer`'s dynamic
  measurement mode instead. Not needed yet; noted as a constraint, not
  solved speculatively.
- The debug render-count badge (`useRenderCount`) is intentionally
  dev/demo-only instrumentation, not a production feature — see
  `docs/TECH_DEBT.md` for the note on gating it behind an env flag if this
  code is ever deployed somewhere a real end user would see it.
- Server-side filtering/sorting (the API route, not the client) means the
  client never has to `useMemo` a large filter/sort pass on every keystroke
  in the first place — the "expensive computation" that `useMemo` classically
  guards against was avoided architecturally rather than memoized away. The
  remaining client-side cost this ADR addresses is purely rendering ~900
  already-correct rows, which is a rendering problem, not a computation one.
