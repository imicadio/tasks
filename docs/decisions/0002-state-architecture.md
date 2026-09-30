# 0002: State architecture — local, global, server, and URL

## Status

Accepted

## Context

Interview feedback specifically called out a shallow answer on "how do you
decide where a piece of state lives" — local vs. global vs. server vs. URL.
The road-accidents feature (the first one built in this repo) answered this
implicitly and inconsistently: filters lived in `useState`, "server data"
was fetched with a hand-rolled `useEffect` + `fetch` + `useState` combo with
manual cancellation, and there was no global client state at all. That's a
reasonable MVP but not a defensible architecture — nothing there was a
*decision*, it was just whatever was easiest to type first.

The hydro-monitor feature (river gauge stations, with live water levels
compared against warning/alarm thresholds) needs all four kinds of state at
once, which forced the question explicitly.

## Decision

Four kinds of state, one rule for picking among them: **who is the source
of truth, and who else needs to see it?**

| Kind | Owns the value | Example in this repo | Tool |
|---|---|---|---|
| **Local** | This component only | Search input's raw text before it's debounced; row hover state; the naive/optimized perf-demo toggle | `useState` |
| **Global (client)** | The app, across components, across sessions | Favorited/pinned stations | Zustand (`persist` middleware → `localStorage`) |
| **Server** | The backend / an external system | The station list itself, fetched from our own API route which proxies IMGW | TanStack Query |
| **URL** | Whatever's typed in the address bar, shareable | Search text (after debounce), status filter, voivodeship filter, sort field/direction | `useSearchParams` / `router.replace` via a small `useUrlState` hook (`src/shared/hooks/use-url-state.ts`) |

The decision tree, in order:

1. **Does another system own this data?** (IMGW, in this repo's case) → it's
   server state. Don't duplicate it into `useState`; fetch it, cache it, let
   the fetching library own staleness/revalidation/loading/error states
   instead of hand-rolling them.
2. **Should a link to this view reproduce what the person is looking at?**
   → URL state. If you'd want to paste a link to "alarm-level stations in
   pomorskie, sorted by water level" into a chat message, it has to live in
   the URL, not in React state that resets on reload.
3. **Does more than one part of the tree need it, and should it survive a
   reload or navigation?** → global client state (Zustand here). Favorites
   are the textbook case: the filter bar's "only favorites" toggle and
   every row's star button both read the same list, and there's no
   reasonable universe where a page reload should un-favorite a station.
4. **Otherwise** → local state. The search input's *raw* keystrokes are the
   clearest example of a value that must NOT be one of the above: it's not
   server data, it's not meaningfully shareable at 60fps of keystrokes, and
   nothing outside the input needs to see the value before it settles.

The search box is the case that touches three of the four categories at
once and is worth spelling out: typing goes into **local** state
immediately (so the input never feels laggy), a debounce (300ms) settles
it, and only the settled value is written into **URL** state (so the actual
query — what's sent to the **server** — only changes once you stop typing,
not on every keystroke).

React Query's `initialData` is seeded from the Server Component's own
render (`page.tsx` parses the same `searchParams`, calls the same
filter/sort function, and hands the client component matching data), so
the first paint has real data and TanStack Query's cache key matches
exactly what the client would have fetched anyway — no duplicate request,
no flash of empty state.

## Consequences

- Four concepts to explain instead of one undifferentiated blob of
  `useState`, but each one now answers a specific question a reviewer (or
  an interviewer) can ask: "why isn't the water level in Zustand?" — because
  it's server data, and Zustand isn't a cache. "Why isn't the favorites
  list in the URL?" — because it's personal and page reloads shouldn't
  reset it, but sharing a link to *someone else's* favorites list makes no
  sense either.
- New dependencies: `@tanstack/react-query`, `zustand`. Both are
  industry-standard, small, and each solves exactly one of these four
  problems rather than being a general "state management" hammer.
- URL state is hand-rolled (`useUrlState`) rather than using a library like
  `nuqs`. Considered and rejected for now: the hand-rolled version is ~30
  lines, has zero dependencies, and is simple enough that writing it was a
  better demonstration of understanding the underlying mechanism than
  importing it. Revisit if the number of URL-synced fields or their
  serialization needs (arrays, dates) grow past what a plain
  `URLSearchParams` round-trip handles comfortably.
- The road-accidents feature was **not** retrofitted to this model. It
  still uses its original hand-rolled fetch+useState. That's intentional —
  see `docs/TECH_DEBT.md` — rewriting working code purely for consistency,
  with no user-facing benefit, is its own kind of waste.
