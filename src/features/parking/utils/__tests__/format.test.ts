import { describe, expect, it } from "vitest";
import { formatDateTime, spotsWord } from "../format";

describe("spotsWord", () => {
  it.each([
    [1, "miejsce"],
    [2, "miejsca"],
    [4, "miejsca"],
    [5, "miejsc"],
    [12, "miejsc"],
    [14, "miejsc"],
    [22, "miejsca"],
    [869, "miejsc"],
    [0, "miejsc"],
  ])("%i → %s", (count, word) => {
    expect(spotsWord(count)).toBe(word);
  });
});

describe("formatDateTime", () => {
  it("formats in Warsaw time regardless of the runtime's zone", () => {
    expect(formatDateTime("2026-10-03T21:56:39Z")).toBe("03.10, 23:56");
  });

  it("renders a dash for missing or invalid input", () => {
    expect(formatDateTime(null)).toBe("—");
    expect(formatDateTime("garbage")).toBe("—");
  });
});
