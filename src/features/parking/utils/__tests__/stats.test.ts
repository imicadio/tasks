import { describe, expect, it } from "vitest";
import type { ParkingLot } from "../../types";
import { countFullLots, totalFreeSpots } from "../stats";

function lot(availableSpots: number | null, status: ParkingLot["status"]) {
  return { availableSpots, status } as ParkingLot;
}

describe("parking stats", () => {
  const lots = [lot(0, "full"), lot(15, "few"), lot(null, "unknown"), lot(40, "available")];

  it("counts full lots", () => {
    expect(countFullLots(lots)).toBe(1);
  });

  it("sums free spots, skipping lots without a reading", () => {
    expect(totalFreeSpots(lots)).toBe(55);
  });
});
