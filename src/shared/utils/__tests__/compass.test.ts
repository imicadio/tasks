import { describe, expect, it } from "vitest";
import { degreesToCompass } from "../compass";

describe("degreesToCompass", () => {
  it("maps the four cardinal directions", () => {
    expect(degreesToCompass(0)).toBe("N");
    expect(degreesToCompass(90)).toBe("E");
    expect(degreesToCompass(180)).toBe("S");
    expect(degreesToCompass(270)).toBe("W");
  });

  it("wraps 360 back to N", () => {
    expect(degreesToCompass(360)).toBe("N");
  });

  it("handles negative degrees by wrapping", () => {
    expect(degreesToCompass(-90)).toBe("W");
  });

  it("rounds to the nearest 16-point label", () => {
    expect(degreesToCompass(100)).toBe("E"); // closer to 90° (E) than 112.5° (ESE)
    expect(degreesToCompass(110)).toBe("ESE"); // closer to 112.5° (ESE) than 90° (E)
  });
});
