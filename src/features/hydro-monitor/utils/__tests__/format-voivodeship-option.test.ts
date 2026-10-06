import { describe, expect, it } from "vitest";
import { formatVoivodeshipOption } from "../format-voivodeship-option";

describe("formatVoivodeshipOption", () => {
  it("names the 'all' option and passes real names through", () => {
    expect(formatVoivodeshipOption("all")).toBe("Wszystkie województwa");
    expect(formatVoivodeshipOption("pomorskie")).toBe("pomorskie");
  });
});
