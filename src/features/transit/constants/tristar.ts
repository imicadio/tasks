// Tristar (ZTM Gdańsk / tri-city public transport) live GPS feed. No API
// key required. See https://ckan.multimediagdansk.pl/dataset/tristar for
// the dataset listing.
export const TRISTAR_GPS_URL = "https://ckan2.multimediagdansk.pl/gpsPositions?v=2";

// "Lista linii" — maps each routeId to a routeType ("BUS"/"TRAM"/other).
// This is how vehicle type is determined for map/list coloring — not
// guessed from the route number. Verified live: every currently-active
// vehicle's routeId resolves to BUS or TRAM here, with none falling
// through to "other" at the time this was checked (see README.md).
export const TRISTAR_ROUTES_URL =
  "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/22313c56-5acf-41c7-a5fd-dc5dc72b3851/download/routes.json";

// The source itself refreshes each vehicle roughly every 20s and drops a
// vehicle from the feed up to 5 minutes after its last transmission — see
// README.md. We poll faster than that floor so the client's view of
// "who's still out there" stays reasonably current without hammering a
// public, unauthenticated endpoint.
export const POLL_INTERVAL_MS = 15_000;

// Server-side cache of the GPS feed. Short enough that a page load is at
// most one poll behind (below POLL_INTERVAL_MS and the source's own ~20s
// refresh), long enough that concurrent viewers and SSR share one upstream
// read instead of each waiting on Tristar.
export const GPS_REVALIDATE_S = 10;
