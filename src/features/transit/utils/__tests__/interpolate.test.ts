import { describe, expect, it } from "vitest";
import { interpolateLatLng, lerp } from "../interpolate";

describe("lerp", () => {
  it("interpolates linearly between two values", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
  });

  it("clamps t outside [0, 1]", () => {
    expect(lerp(0, 10, -1)).toBe(0);
    expect(lerp(0, 10, 2)).toBe(10);
  });
});

describe("interpolateLatLng", () => {
  it("interpolates both coordinates independently", () => {
    const from = { lat: 54.3, lon: 18.6 };
    const to = { lat: 54.4, lon: 18.8 };
    const result = interpolateLatLng(from, to, 0.5);
    expect(result.lat).toBeCloseTo(54.35);
    expect(result.lon).toBeCloseTo(18.7);
  });

  it("returns the start point at t=0 and the end point at t=1", () => {
    const from = { lat: 54.3, lon: 18.6 };
    const to = { lat: 54.4, lon: 18.8 };
    expect(interpolateLatLng(from, to, 0)).toEqual(from);
    expect(interpolateLatLng(from, to, 1)).toEqual(to);
  });
});
