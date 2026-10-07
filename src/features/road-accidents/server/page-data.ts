import "server-only";
import { DEFAULT_METRIC, MAX_YEAR, METRIC } from "../constants";
import type { RoadAccidentsPageData } from "../types";
import {
  getNationalTrend,
  getVoivodeshipBreakdown,
  getYearValue,
} from "./queries";

/** Data for the dashboard's first render: the default metric's trend and
 * voivodeship breakdown, plus every metric's latest-year value for the
 * KPI tiles. All GUS requests run in parallel. */
export async function getRoadAccidentsPageData(): Promise<RoadAccidentsPageData> {
  const [trend, breakdown, accidents, fatalities, injured] = await Promise.all([
    getNationalTrend(DEFAULT_METRIC),
    getVoivodeshipBreakdown(DEFAULT_METRIC, MAX_YEAR),
    getYearValue(METRIC.Accidents),
    getYearValue(METRIC.Fatalities),
    getYearValue(METRIC.Injured),
  ]);

  return { trend, breakdown, latest: { accidents, fatalities, injured } };
}
