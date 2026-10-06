import { describe, expect, it } from "vitest";
import { filterAndSortStations } from "../queries";
import { toStationId } from "../../utils/to-station-id";
import type { HydroStation } from "../../types";

function station(overrides: Partial<HydroStation>): HydroStation {
  return {
    id: toStationId(1),
    name: "Test",
    river: "Testówka",
    voivodeship: "testowe",
    lon: 0,
    lat: 0,
    waterLevelCm: 100,
    warningLevelCm: 200,
    alarmLevelCm: 300,
    measuredAt: null,
    status: "normal",
    ...overrides,
  };
}

const stations: HydroStation[] = [
  station({ id: toStationId(1), name: "Bystra", status: "alarm", waterLevelCm: 350 }),
  station({ id: toStationId(2), name: "Alfa", status: "normal", waterLevelCm: 50 }),
  station({ id: toStationId(3), name: "Warta", status: "warning", waterLevelCm: 250, voivodeship: "inne" }),
  station({ id: toStationId(4), name: "Cicha", status: "unknown", waterLevelCm: null }),
];

describe("filterAndSortStations", () => {
  it("filters by status", () => {
    const result = filterAndSortStations(stations, {
      q: "",
      status: "alarm",
      voivodeship: "all",
      sort: "name",
      dir: "asc",
    });
    expect(result.map((s) => s.name)).toEqual(["Bystra"]);
  });

  it("filters by voivodeship", () => {
    const result = filterAndSortStations(stations, {
      q: "",
      status: "all",
      voivodeship: "inne",
      sort: "name",
      dir: "asc",
    });
    expect(result.map((s) => s.name)).toEqual(["Warta"]);
  });

  it("filters by a case-insensitive search across name and river", () => {
    const result = filterAndSortStations(stations, {
      q: "bystra",
      status: "all",
      voivodeship: "all",
      sort: "name",
      dir: "asc",
    });
    expect(result.map((s) => s.name)).toEqual(["Bystra"]);
  });

  it("sorts by status with alarm first by default order", () => {
    const result = filterAndSortStations(stations, {
      q: "",
      status: "all",
      voivodeship: "all",
      sort: "status",
      dir: "asc",
    });
    expect(result.map((s) => s.status)).toEqual([
      "alarm",
      "warning",
      "unknown",
      "normal",
    ]);
  });

  it("sorts by water level, treating null as lowest", () => {
    const result = filterAndSortStations(stations, {
      q: "",
      status: "all",
      voivodeship: "all",
      sort: "waterLevelCm",
      dir: "asc",
    });
    expect(result.map((s) => s.name)).toEqual([
      "Cicha",
      "Alfa",
      "Warta",
      "Bystra",
    ]);
  });

  it("sorts by name using Polish collation, descending", () => {
    const result = filterAndSortStations(stations, {
      q: "",
      status: "all",
      voivodeship: "all",
      sort: "name",
      dir: "desc",
    });
    expect(result.map((s) => s.name)).toEqual([
      "Warta",
      "Cicha",
      "Bystra",
      "Alfa",
    ]);
  });
});
