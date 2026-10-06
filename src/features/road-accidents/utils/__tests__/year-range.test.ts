import { describe, expect, it } from "vitest";
import { yearRange } from "../year-range";

describe("yearRange", () => {
  it("lists every year inclusive, oldest first", () => {
    expect(yearRange(2022, 2025)).toEqual([2022, 2023, 2024, 2025]);
  });

  it("returns a single year when both ends match", () => {
    expect(yearRange(2025, 2025)).toEqual([2025]);
  });
});
