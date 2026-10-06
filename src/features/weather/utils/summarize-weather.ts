import type {
  WeatherStation,
  WeatherStationWithTemp,
  WeatherSummary,
} from "../types";

/** Average, warmest and coldest temperature across every station that
 * reported one. */
export function summarizeWeather(stations: WeatherStation[]): WeatherSummary {
  const withTemp = stations.filter(
    (s): s is WeatherStationWithTemp => s.temperatureC !== null,
  );
  const avgTemperatureC = withTemp.length
    ? withTemp.reduce((sum, s) => sum + s.temperatureC, 0) / withTemp.length
    : null;
  const warmest = withTemp.length
    ? withTemp.reduce((a, b) => (a.temperatureC > b.temperatureC ? a : b))
    : null;
  const coldest = withTemp.length
    ? withTemp.reduce((a, b) => (a.temperatureC < b.temperatureC ? a : b))
    : null;

  return { avgTemperatureC, warmest, coldest, stationCount: stations.length };
}
