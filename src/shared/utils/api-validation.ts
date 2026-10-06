import { z } from "zod";

/**
 * Some public APIs (looking at you, IMGW — see
 * docs/decisions/0003-api-data-validation.md) don't consistently type
 * numeric fields across their own response array: the same field comes
 * back as a JSON number for most records and a numeric string for others,
 * with `null` or `""` standing in for "no data". This normalizes all of
 * those into `number | null` before validation, so a schema built on it
 * doesn't reject an otherwise-valid record deep in a large array just
 * because that one field happened to serialize differently.
 */
export function apiNullableNumber() {
  return z.preprocess((value) => {
    if (value === null || value === undefined || value === "") return null;
    const num = typeof value === "number" ? value : Number(value);
    return Number.isNaN(num) ? null : num;
  }, z.number().nullable());
}
