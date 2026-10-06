import { DATE_TIME_FORMAT, MISSING_VALUE, TIME_FORMAT } from "../constants";
import type { ParkingLot } from "../types";

export function formatDateTime(iso: string | null): string {
  if (!iso) return MISSING_VALUE;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? MISSING_VALUE : DATE_TIME_FORMAT.format(date);
}

export function formatTime(iso: string | null): string {
  if (!iso) return MISSING_VALUE;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? MISSING_VALUE : TIME_FORMAT.format(date);
}

/** Polish plural for "miejsce": 1 miejsce, 2-4 miejsca, 5+ miejsc
 * (12-14 → miejsc). */
export function spotsWord(count: number): string {
  if (count === 1) return "miejsce";
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return "miejsca";
  }
  return "miejsc";
}

/** "P01 · Galeria Bałtycka" — the marker tooltip. */
export function formatLotName(lot: ParkingLot): string {
  return `${lot.shortName} · ${lot.name}`;
}
