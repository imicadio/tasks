import { yearRange } from "../utils/year-range";

export const MIN_YEAR = 2000;
export const MAX_YEAR = 2025;

/** Every year with data, newest first — the year picker's options. */
export const YEARS_DESC = yearRange(MIN_YEAR, MAX_YEAR).reverse();
