import { describe, expect, it } from "vitest";
import type { Vehicle } from "../../types";
import { formatAverageDelay, formatDelay, formatVehicleTooltip } from "../format";

describe("formatDelay", () => {
  it("says on time within a minute either way", () => {
    expect(formatDelay(59)).toBe("na czas");
    expect(formatDelay(-59)).toBe("na czas");
  });

  it("shows signed whole minutes otherwise", () => {
    expect(formatDelay(180)).toBe("+3 min");
    expect(formatDelay(-120)).toBe("-2 min");
  });
});

describe("formatAverageDelay", () => {
  it("always shows a sign for non-negative values", () => {
    expect(formatAverageDelay(0)).toBe("+0 min");
    expect(formatAverageDelay(185)).toBe("+3 min");
    expect(formatAverageDelay(-120)).toBe("-2 min");
  });
});

describe("formatVehicleTooltip", () => {
  it("joins route and headsign, with ? for a missing headsign", () => {
    const base = { routeShortName: "148" } as Vehicle;
    expect(formatVehicleTooltip({ ...base, headsign: "Wrzeszcz PKP" })).toBe(
      "148 → Wrzeszcz PKP",
    );
    expect(formatVehicleTooltip({ ...base, headsign: "" })).toBe("148 → ?");
  });
});
