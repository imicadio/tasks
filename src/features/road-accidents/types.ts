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
