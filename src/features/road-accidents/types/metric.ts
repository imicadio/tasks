import type { ValueOf } from "@/shared/types/value-of";
import type { METRIC } from "../constants";

export type Metric = ValueOf<typeof METRIC>;

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
