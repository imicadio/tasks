/** Escapes text for interpolation into an HTML string (e.g. a Leaflet
 * `divIcon`'s `html`), where React's own escaping doesn't apply. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
