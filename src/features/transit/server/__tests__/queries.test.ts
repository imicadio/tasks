import { describe, expect, it } from "vitest";
import { applyVehicleTypes, filterByRoute } from "../queries";
import type { Vehicle, VehicleType } from "../../types";

function vehicle(overrides: Partial<Vehicle>): Vehicle {
  return {
    id: 1 as Vehicle["id"],
    routeId: 3,
    routeShortName: "3",
    vehicleType: "tram",
    headsign: "Brzeźno",
    vehicleCode: "1014",
    lat: 54.34,
    lon: 18.63,
    speedKmh: 25,
    direction: 90,
    delaySeconds: 0,
    generatedAt: "2026-10-03T15:27:20Z",
    ...overrides,
  };
}

describe("filterByRoute", () => {
  const vehicles = [
    vehicle({ id: 1 as Vehicle["id"], routeShortName: "3" }),
    vehicle({ id: 2 as Vehicle["id"], routeShortName: "148" }),
    vehicle({ id: 3 as Vehicle["id"], routeShortName: "M32" }),
  ];

  it("returns everything when the filter is empty", () => {
    expect(filterByRoute(vehicles, "")).toHaveLength(3);
  });

  it("matches a route substring case-insensitively", () => {
    expect(filterByRoute(vehicles, "m32").map((v) => v.id)).toEqual([3]);
  });

  it("matches a numeric prefix shared by multiple routes", () => {
    // not "1" and "48" separately — filtering is substring-of-routeShortName
    expect(filterByRoute(vehicles, "14").map((v) => v.id)).toEqual([2]);
  });
});

describe("applyVehicleTypes", () => {
  it("looks up each vehicle's type by routeId", () => {
    const routeTypes = new Map<number, VehicleType>([
      [3, "tram"],
      [148, "bus"],
    ]);
    const result = applyVehicleTypes(
      [
        vehicle({ id: 1 as Vehicle["id"], routeId: 3 }),
        vehicle({ id: 2 as Vehicle["id"], routeId: 148 }),
      ],
      routeTypes,
    );
    expect(result.map((v) => v.vehicleType)).toEqual(["tram", "bus"]);
  });

  it("falls back to \"other\" for a routeId absent from the routes feed", () => {
    const result = applyVehicleTypes(
      [vehicle({ id: 1 as Vehicle["id"], routeId: 999 })],
      new Map(),
    );
    expect(result[0].vehicleType).toBe("other");
  });
});
