import { describe, expect, it } from "vitest";
import { virtualRowStyle } from "../virtual-row-style";

describe("virtualRowStyle", () => {
  it("places the row at its virtual offset with its own height", () => {
    expect(virtualRowStyle({ size: 56, start: 112 })).toMatchObject({
      position: "absolute",
      height: 56,
      transform: "translateY(112px)",
    });
  });
});
