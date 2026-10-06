import "server-only";
import {
  GUS_BASE_URL,
  MAX_YEAR,
  METRIC_VARIABLE_ID,
  MIN_YEAR,
  POLAND_UNIT_LEVEL,
  VOIVODESHIP_UNIT_LEVEL,
} from "../constants";
import { gusByVariableResponseSchema } from "../schemas";
import type { Metric, VoivodeshipDatum, YearDatum } from "../types";
import { yearRange } from "../utils/year-range";

async function fetchGusByVariable(
  variableId: number,
  unitLevel: number,
  years: number[],
) {
  const params = new URLSearchParams({
    "unit-level": String(unitLevel),
    format: "json",
    "page-size": "100",
  });
  for (const year of years) params.append("year", String(year));

  const response = await fetch(
    `${GUS_BASE_URL}/data/by-variable/${variableId}?${params}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error(
      `GUS BDL request failed: ${response.status} ${response.statusText}`,
    );
  }

  return gusByVariableResponseSchema.parse(await response.json());
}

export async function getNationalTrend(
  metric: Metric,
  fromYear: number = MIN_YEAR,
  toYear: number = MAX_YEAR,
): Promise<YearDatum[]> {
  const years = yearRange(fromYear, toYear);
  const data = await fetchGusByVariable(
    METRIC_VARIABLE_ID[metric],
    POLAND_UNIT_LEVEL,
    years,
  );
  const poland = data.results[0];
  const byYear = new Map(
    poland?.values.map((v) => [Number(v.year), v.val]) ?? [],
  );
  return years.map((year) => ({ year, value: byYear.get(year) ?? null }));
}

export async function getVoivodeshipBreakdown(
  metric: Metric,
  year: number = MAX_YEAR,
): Promise<VoivodeshipDatum[]> {
  const data = await fetchGusByVariable(
    METRIC_VARIABLE_ID[metric],
    VOIVODESHIP_UNIT_LEVEL,
    [year],
  );
  return data.results
    .map((result) => ({
      id: result.id,
      name: result.name,
      value: result.values[0]?.val ?? null,
    }))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
}

/** A metric's national value for a single year (`null` when GUS has none). */
export async function getYearValue(
  metric: Metric,
  year: number = MAX_YEAR,
): Promise<number | null> {
  const [datum] = await getNationalTrend(metric, year, year);
  return datum?.value ?? null;
}
