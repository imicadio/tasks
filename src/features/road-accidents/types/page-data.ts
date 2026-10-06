import type {
  LatestByMetric,
  Metric,
  VoivodeshipDatum,
  YearDatum,
} from "./metric";

/** Everything the dashboard page needs for its first, server-side render. */
export type RoadAccidentsPageData = {
  trend: YearDatum[];
  breakdown: VoivodeshipDatum[];
  latest: LatestByMetric;
};

/** Initial filter state and data for `useRoadAccidents`. */
export type RoadAccidentsInitialState = {
  metric: Metric;
  year: number;
  trend: YearDatum[];
  breakdown: VoivodeshipDatum[];
};
