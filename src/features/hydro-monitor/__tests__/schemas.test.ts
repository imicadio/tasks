import { describe, expect, it } from "vitest";
import { hydroQuerySchema, hydroStationsResponseSchema } from "../schemas";

describe("hydroStationsResponseSchema", () => {
  it("parses a normal, fully-numeric record", () => {
    const result = hydroStationsResponseSchema.parse([
      {
        id_stacji: 151140030,
        stacja: "Przewoźniki",
        rzeka: "Skroda",
        wojewodztwo: "lubuskie",
        lon: 14.8217,
        lat: 51.5253,
        stan_wody: 225,
        stan_wody_data_pomiaru: "2026-09-30 17:20:00",
        stan_ostrzegawczy: 300,
        stan_alarmowy: 340,
      },
    ]);
    expect(result[0]).toMatchObject({
      id: "151140030",
      name: "Przewoźniki",
      waterLevelCm: 225,
      status: "normal",
    });
  });

  it("regression: parses a record where numeric fields arrived as strings — reproduces the shape observed live at index 911-912 of the real API response, which crashed a schema built on plain z.number()", () => {
    const result = hydroStationsResponseSchema.parse([
      {
        id_stacji: "153190040",
        stacja: "Bągart",
        rzeka: "Dzierzgoń",
        wojewodztwo: "pomorskie",
        lon: "19.3692",
        lat: "53.9661",
        stan_wody: "694",
        stan_wody_data_pomiaru: "2026-09-30 17:30:00",
        stan_ostrzegawczy: "790",
        stan_alarmowy: "800",
      },
    ]);
    expect(result[0]).toMatchObject({
      id: "153190040",
      lon: 19.3692,
      lat: 53.9661,
      waterLevelCm: 694,
      status: "normal", // 694 < warning threshold 790
    });
  });

  it("maps null/empty-string readings to null rather than 0 or NaN", () => {
    const result = hydroStationsResponseSchema.parse([
      {
        id_stacji: 154190080,
        stacja: "Żukowo",
        rzeka: "Jez. Drużno",
        wojewodztwo: "warmińsko-mazurskie",
        lon: null,
        lat: null,
        stan_wody: null,
        stan_wody_data_pomiaru: "2026-09-30 17:20:00",
        stan_ostrzegawczy: "",
        stan_alarmowy: 570,
      },
    ]);
    expect(result[0]).toMatchObject({
      waterLevelCm: null,
      warningLevelCm: null,
      alarmLevelCm: 570,
      status: "unknown",
    });
  });

  it("rejects a record missing a required field", () => {
    expect(() =>
      hydroStationsResponseSchema.parse([{ stacja: "No id" }]),
    ).toThrow();
  });
});

describe("hydroQuerySchema", () => {
  it("applies defaults", () => {
    expect(hydroQuerySchema.parse({})).toEqual({
      q: "",
      status: "all",
      voivodeship: "all",
      sort: "status",
      dir: "desc",
    });
  });

  it("rejects an unknown status", () => {
    expect(() => hydroQuerySchema.parse({ status: "flooded" })).toThrow();
  });
});
