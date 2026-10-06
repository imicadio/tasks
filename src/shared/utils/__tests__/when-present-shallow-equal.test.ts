import { describe, expect, it, vi } from "vitest";
import { shallowEqual } from "../shallow-equal";
import { whenPresent } from "../when-present";

describe("whenPresent", () => {
  it("passes values through and ignores null", () => {
    const setter = vi.fn();
    const handler = whenPresent(setter);
    handler("asc");
    handler(null);
    expect(setter).toHaveBeenCalledTimes(1);
    expect(setter).toHaveBeenCalledWith("asc");
  });
});

describe("shallowEqual", () => {
  it("compares own keys by identity", () => {
    expect(shallowEqual({ q: "", sort: "name" }, { q: "", sort: "name" })).toBe(true);
    expect(shallowEqual({ q: "", sort: "name" }, { q: "x", sort: "name" })).toBe(false);
  });
});
