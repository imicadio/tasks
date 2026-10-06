/** OpenStreetMap's reverse geocoder. Free, no key, but its usage policy asks
 * for an identifying User-Agent and at most ~1 request/s — so it's called
 * only from our own route handler (cached per point), never from the browser.
 * https://operations.osmfoundation.org/policies/nominatim/ */
export const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
export const GEOCODE_USER_AGENT = "Dashboardy/0.1 (https://github.com/imicadio/tasks)";
/** Addresses don't move; a day of caching per rounded point is plenty. */
export const GEOCODE_REVALIDATE_S = 86_400;
/** Map clicks are rounded to this many decimals (~11 cm) — enough precision,
 * and it keeps the geocode cache keys stable. */
export const COORD_DECIMALS = 6;
