import { describe, expect, it } from "vitest";
import {
  normalizeDirection,
  routeTypeMapSchema,
  transitQuerySchema,
  vehiclesSnapshotSchema,
} from "../schemas";

describe("normalizeDirection", () => {
  it("passes through an already-valid compass point", () => {
    expect(normalizeDirection(90)).toBe(90);
  });

  it("snaps an unexpected value to the nearest 45° point", () => {
    expect(normalizeDirection(100)).toBe(90);
    expect(normalizeDirection(112)).toBe(90); // below the 112.5° midpoint
    expect(normalizeDirection(113)).toBe(135); // above the midpoint
  });

  it("wraps 360 and negative values into [0, 360)", () => {
    expect(normalizeDirection(360)).toBe(0);
    expect(normalizeDirection(-45)).toBe(315);
  });
});

describe("vehiclesSnapshotSchema", () => {
  const BASE = {
    vehicleId: 404,
    routeId: 3,
    routeShortName: "3",
    headsign: "Brzeźno",
    vehicleCode: "1014",
    speed: 25,
    direction: 90,
    delay: -114,
    generated: "2026-10-03T15:27:20Z",
  };

  it("parses a normal vehicle", () => {
    const result = vehiclesSnapshotSchema.parse({
      lastUpdate: "2026-10-03T15:27:42Z",
      vehicles: [{ ...BASE, lat: 54.34, lon: 18.63 }],
    });
    expect(result.vehicles[0]).toMatchObject({
      id: 404,
      routeId: 3,
      routeShortName: "3",
      lat: 54.34,
      lon: 18.63,
      direction: 90,
      // Pre-enrichment default — getVehiclePositions() replaces this with
      // a real lookup from the routes feed; see applyVehicleTypes in
      // server/queries.ts (and its own tests).
      vehicleType: "other",
    });
  });

  it("drops a vehicle with no position rather than fabricating (0, 0)", () => {
    const result = vehiclesSnapshotSchema.parse({
      lastUpdate: "2026-10-03T15:27:42Z",
      vehicles: [
        { ...BASE, lat: null, lon: null },
        { ...BASE, vehicleId: 405, lat: 54.34, lon: 18.63 },
      ],
    });
    expect(result.vehicles).toHaveLength(1);
    expect(result.vehicles[0].id).toBe(405);
  });

  it("defaults a missing headsign to an empty string, not null", () => {
    const result = vehiclesSnapshotSchema.parse({
      lastUpdate: "2026-10-03T15:27:42Z",
      vehicles: [{ ...BASE, headsign: null, lat: 54.34, lon: 18.63 }],
    });
    expect(result.vehicles[0].headsign).toBe("");
  });

  it("coerces numeric-string fields, matching the IMGW-style defensiveness used elsewhere", () => {
    const result = vehiclesSnapshotSchema.parse({
      lastUpdate: "2026-10-03T15:27:42Z",
      vehicles: [
        {
          ...BASE,
          lat: "54.34",
          lon: "18.63",
          speed: "25",
          delay: "-114",
        },
      ],
    });
    expect(result.vehicles[0]).toMatchObject({
      lat: 54.34,
      lon: 18.63,
      speedKmh: 25,
      delaySeconds: -114,
    });
  });
});

describe("transitQuerySchema", () => {
  it("defaults route to an empty string", () => {
    expect(transitQuerySchema.parse({})).toEqual({ route: "" });
  });
});

describe("routeTypeMapSchema", () => {
  it("builds a routeId → type map from the real response shape", () => {
    const result = routeTypeMapSchema.parse({
      "2026-10-03": {
        lastUpdate: "2026-10-03 02:34:34",
        routes: [
          { routeId: 3, routeType: "TRAM" },
          { routeId: 148, routeType: "BUS" },
          { routeId: 10086, routeType: "UNKNOWN" },
        ],
      },
    });
    expect(result.get(3)).toBe("tram");
    expect(result.get(148)).toBe("bus");
    expect(result.get(10086)).toBe("other");
    expect(result.get(999)).toBeUndefined();
  });

  it("merges routes across multiple date keys, if more than one is present", () => {
    const result = routeTypeMapSchema.parse({
      "2026-10-02": {
        lastUpdate: "2026-10-02 00:00:00",
        routes: [{ routeId: 1, routeType: "TRAM" }],
      },
      "2026-10-03": {
        lastUpdate: "2026-10-03 00:00:00",
        routes: [{ routeId: 2, routeType: "BUS" }],
      },
    });
    expect(result.get(1)).toBe("tram");
    expect(result.get(2)).toBe("bus");
  });
});
