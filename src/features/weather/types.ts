export type WeatherStation = {
  id: string;
  name: string;
  measuredAt: string | null;
  temperatureC: number | null;
  windSpeedMs: number | null;
  windDirectionDeg: number | null;
  humidityPct: number | null;
  precipitationMm: number | null;
  pressureHpa: number | null;
};

export type WeatherSortField = "name" | "temperatureC" | "windSpeedMs";
export type SortDirection = "asc" | "desc";
