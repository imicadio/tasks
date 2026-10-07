import { describe, expect, it } from "vitest";
import { toVehicleType } from "../to-vehicle-type";

describe("toVehicleType", () => {
  it("maps known route types and falls back to other", () => {
    expect(toVehicleType("BUS")).toBe("bus");
    expect(toVehicleType("TRAM")).toBe("tram");
    expect(toVehicleType("FERRY")).toBe("other");
    expect(toVehicleType("toString")).toBe("other");
  });
});
