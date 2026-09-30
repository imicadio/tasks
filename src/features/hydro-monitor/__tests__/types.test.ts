import { describe, expect, it } from "vitest";
import { deriveStationStatus } from "../types";

describe("deriveStationStatus", () => {
  it("returns unknown when there is no water level reading", () => {
    expect(deriveStationStatus(null, 100, 200)).toBe("unknown");
  });

  it("returns normal when below both thresholds", () => {
    expect(deriveStationStatus(50, 100, 200)).toBe("normal");
  });

  it("returns warning at or above the warning threshold but below alarm", () => {
    expect(deriveStationStatus(100, 100, 200)).toBe("warning");
    expect(deriveStationStatus(150, 100, 200)).toBe("warning");
  });

  it("returns alarm at or above the alarm threshold", () => {
    expect(deriveStationStatus(200, 100, 200)).toBe("alarm");
    expect(deriveStationStatus(999, 100, 200)).toBe("alarm");
  });

  it("returns normal when thresholds are missing, even with a reading", () => {
    expect(deriveStationStatus(500, null, null)).toBe("normal");
  });
});
