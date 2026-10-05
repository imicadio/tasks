import { describe, expect, it } from "vitest";
import { createReference, formatCoords } from "../format";

describe("createReference", () => {
  it("combines the local date with a zero-padded random suffix", () => {
    expect(createReference(new Date(2026, 9, 5, 12), 0.0427)).toBe("ZGL-20261005-0427");
    expect(createReference(new Date(2026, 0, 9), 0)).toBe("ZGL-20260109-0000");
  });
});

describe("formatCoords", () => {
  it("rounds to 5 decimal places", () => {
    expect(formatCoords(54.379234567, 18.6)).toBe("54.37923, 18.60000");
  });
});
