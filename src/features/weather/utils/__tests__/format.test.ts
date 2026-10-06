import { describe, expect, it } from "vitest";
import type { WeatherStation } from "../../types";
import {
  formatMeasurementHour,
  formatTemp,
  formatTempAtStation,
  formatWindDirection,
  formatWithUnit,
} from "../format";

describe("weather formatters", () => {
  it("appends the unit, or shows a dash when missing", () => {
    expect(formatWithUnit(1013, " hPa")).toBe("1013 hPa");
    expect(formatWithUnit(80, "%")).toBe("80%");
    expect(formatWithUnit(null, " hPa")).toBe("—");
  });

  it("formats temperature with one decimal", () => {
    expect(formatTemp(21.44)).toBe("21.4 °C");
    expect(formatTemp(null)).toBe("—");
  });

  it("formats the measurement hour as a clock time", () => {
    expect(formatMeasurementHour("12")).toBe("12:00");
    expect(formatMeasurementHour(null)).toBe("—");
  });

  it("adds the compass label to the wind direction", () => {
    expect(formatWindDirection(225)).toBe("225° (SW)");
    expect(formatWindDirection(null)).toBe("—");
  });

  it("pairs a temperature with its station name", () => {
    const station = { name: "Kraków", temperatureC: 21.4 } as WeatherStation;
    expect(formatTempAtStation(station)).toBe("21.4 °C — Kraków");
    expect(formatTempAtStation(null)).toBe("—");
  });
});
