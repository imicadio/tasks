import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRenderCount } from "../use-render-count";

describe("useRenderCount", () => {
  it("starts at 1 and increments once per render", () => {
    const { result, rerender } = renderHook(() => useRenderCount());
    expect(result.current).toBe(1);
    rerender();
    expect(result.current).toBe(2);
    rerender();
    rerender();
    expect(result.current).toBe(4);
  });
});
