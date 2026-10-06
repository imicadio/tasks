import { describe, expect, it } from "vitest";
import type { HydroStation, StationStatus } from "../../types";
import { countByStatus } from "../count-by-status";
import { formatCm } from "../format-cm";
import { gaugePercent } from "../gauge-percent";
import { listVoivodeships } from "../list-voivodeships";
import { toStationId } from "../to-station-id";

function station(overrides: Partial<HydroStation> = {}): HydroStation {
  return {
    id: toStationId(1),
    name: "Stacja",
    river: "Wisła",
    voivodeship: "mazowieckie",
    lon: 21,
    lat: 52,
    waterLevelCm: 100,
    warningLevelCm: 200,
    alarmLevelCm: 400,
    measuredAt: null,
    status: "normal",
    ...overrides,
  };
}

describe("formatCm", () => {
  it("formats a reading in centimetres", () => {
    expect(formatCm(517)).toBe("517 cm");
  });

  it("shows a dash when there's no reading", () => {
    expect(formatCm(null)).toBe("—");
  });
});

describe("gaugePercent", () => {
  it("measures against the alarm level", () => {
    expect(gaugePercent(station({ waterLevelCm: 100, alarmLevelCm: 400 }))).toBe(25);
  });

  it("falls back to the warning level when there's no alarm level", () => {
    expect(
      gaugePercent(station({ waterLevelCm: 100, alarmLevelCm: null, warningLevelCm: 200 })),
    ).toBe(50);
  });

  it("caps at 100", () => {
    expect(gaugePercent(station({ waterLevelCm: 900, alarmLevelCm: 400 }))).toBe(100);
  });

  it("is null without a reading or any threshold", () => {
    expect(gaugePercent(station({ waterLevelCm: null }))).toBeNull();
    expect(
      gaugePercent(station({ alarmLevelCm: null, warningLevelCm: null })),
    ).toBeNull();
  });
});

describe("listVoivodeships", () => {
  it("dedupes and sorts in Polish alphabetical order", () => {
    const stations = ["śląskie", "lubelskie", "łódzkie", "lubelskie"].map(
      (voivodeship) => station({ voivodeship }),
    );
    expect(listVoivodeships(stations)).toEqual(["lubelskie", "łódzkie", "śląskie"]);
  });
});

describe("countByStatus", () => {
  it("counts every status, including ones with no stations", () => {
    const statuses: StationStatus[] = ["alarm", "normal", "normal"];
    expect(countByStatus(statuses.map((status) => station({ status })))).toEqual({
      alarm: 1,
      warning: 0,
      normal: 2,
      unknown: 0,
    });
  });
});
