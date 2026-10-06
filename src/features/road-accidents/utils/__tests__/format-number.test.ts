import { describe, expect, it } from "vitest";
import { formatNumber } from "../format-number";

describe("formatNumber", () => {
  it("formats with Polish digit grouping", () => {
    expect(formatNumber(20000)).toBe((20000).toLocaleString("pl-PL"));
  });

  it("says data is missing for null", () => {
    expect(formatNumber(null)).toBe("brak danych");
  });
});
