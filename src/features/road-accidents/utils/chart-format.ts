import { formatNumber } from "./format-number";

/** Recharts tooltip value formatter: numbers in Polish formatting, anything
 * else (Recharts types the value loosely) as missing data. */
export function formatTooltipNumber(value: unknown): string {
  return formatNumber(typeof value === "number" ? value : null);
}

/** Recharts tooltip label for the year axis. */
export function formatYearLabel(label: unknown): string {
  return `Rok ${label}`;
}
