/** "54,3812" (Polish decimal comma) and "54.3812" both parse; anything else
 * — including an empty field — is `null`. */
export function parseCoordinate(text: string): number | null {
  const normalized = text.trim().replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}
