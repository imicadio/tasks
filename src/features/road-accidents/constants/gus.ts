import type { Metric } from "../types";

// GUS "Bank Danych Lokalnych" (BDL) public API — https://bdl.stat.gov.pl/api/v1
// Subject P1754 "Wypadki drogowe i ich ofiary" (subgroup 245). No API key
// required for this call volume; see docs in server/queries.ts.
export const GUS_BASE_URL = "https://bdl.stat.gov.pl/api/v1";

// BDL's numeric "level" is not a NUTS level — 0 is the national "Polska"
// aggregate, 2 is voivodeship. Verified live against the API; see
// src/features/road-accidents/README.md.
export const POLAND_UNIT_LEVEL = 0;
export const VOIVODESHIP_UNIT_LEVEL = 2;

export const METRIC_VARIABLE_ID: Record<Metric, number> = {
  accidents: 7849, // wypadki ogółem
  fatalities: 7850, // ofiary śmiertelne
  injured: 7851, // ranni
};
