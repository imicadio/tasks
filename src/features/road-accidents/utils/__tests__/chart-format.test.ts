import { describe, expect, it } from "vitest";
import { formatTooltipNumber, formatYearLabel } from "../chart-format";

describe("chart formatters", () => {
  it("formats numeric tooltip values and treats others as missing", () => {
    expect(formatTooltipNumber(1660)).toBe((1660).toLocaleString("pl-PL"));
    expect(formatTooltipNumber("x")).toBe("brak danych");
  });

  it("labels a year", () => {
    expect(formatYearLabel(2025)).toBe("Rok 2025");
  });
});
