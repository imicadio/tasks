import { describe, expect, it } from "vitest";
import type { WeatherStation } from "../../types";
import { summarizeWeather } from "../summarize-weather";

function station(name: string, temperatureC: number | null): WeatherStation {
  return { name, temperatureC } as WeatherStation;
}

describe("summarizeWeather", () => {
  it("averages and finds extremes among stations with a reading", () => {
    const stations = [station("A", 10), station("B", 20), station("C", null)];
    const summary = summarizeWeather(stations);

    expect(summary.avgTemperatureC).toBe(15);
    expect(summary.warmest?.name).toBe("B");
    expect(summary.coldest?.name).toBe("A");
    expect(summary.stationCount).toBe(3);
  });

  it("returns nulls when no station reported a temperature", () => {
    expect(summarizeWeather([station("A", null)])).toEqual({
      avgTemperatureC: null,
      warmest: null,
      coldest: null,
      stationCount: 1,
    });
  });
});
