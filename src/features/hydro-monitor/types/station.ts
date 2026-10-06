declare const stationIdBrand: unique symbol;
/** Branded so a raw string can't be passed where a validated station id is expected. */
export type StationId = string & { readonly [stationIdBrand]: true };

export type StationStatus = "alarm" | "warning" | "normal" | "unknown";

export type HydroStation = {
  id: StationId;
  name: string;
  river: string;
  voivodeship: string;
  lon: number;
  lat: number;
  waterLevelCm: number | null;
  warningLevelCm: number | null;
  alarmLevelCm: number | null;
  measuredAt: string | null;
  status: StationStatus;
};

/** How many stations are in each status. */
export type StatusCounts = Record<StationStatus, number>;
