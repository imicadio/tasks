// OpenStreetMap's own standard tile server — verified working with no API
// key (CARTO's basemaps, used in an earlier draft, turned out to require one
// despite being commonly cited as free). There's no free, no-key dark tile
// set to match, so dark mode reuses these same tiles under a CSS filter
// (`.dark .leaflet-tile-pane` in globals.css) — see
// docs/decisions/0006-realtime-map-rendering.md.
export const OSM_TILES_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
