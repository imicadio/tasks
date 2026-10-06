/** A count in Polish number formatting, or "brak danych" when missing. */
export function formatNumber(value: number | null): string {
  if (value === null) return "brak danych";
  return value.toLocaleString("pl-PL");
}
