export type Metric = "accidents" | "fatalities" | "injured";

export type YearDatum = {
  year: number;
  value: number | null;
};

export type VoivodeshipDatum = {
  id: string;
  name: string;
  value: number | null;
};

/** Each metric's value for a single year (`null` when GUS has no data). */
export type LatestByMetric = Record<Metric, number | null>;
