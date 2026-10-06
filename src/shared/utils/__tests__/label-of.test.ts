import { describe, expect, it } from "vitest";
import { labelOf } from "../label-of";

describe("labelOf", () => {
  it("looks a key up in the label map", () => {
    const label = labelOf({ asc: "Rosnąco", desc: "Malejąco" });
    expect(label("desc")).toBe("Malejąco");
  });
});
