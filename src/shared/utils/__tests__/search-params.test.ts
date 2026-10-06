import { describe, expect, it } from "vitest";
import { firstValues, requestSearchParams } from "../search-params";

describe("firstValues", () => {
  it("keeps single values and takes the first of repeated ones", () => {
    expect(firstValues({ q: "wisła", status: ["alarm", "warning"] })).toEqual({
      q: "wisła",
      status: "alarm",
    });
  });

  it("keeps undefined values as undefined", () => {
    expect(firstValues({ q: undefined })).toEqual({ q: undefined });
  });
});

describe("requestSearchParams", () => {
  it("returns the query string as a plain object", () => {
    const request = new Request("http://localhost/api/x?route=10&page=2");
    expect(requestSearchParams(request)).toEqual({ route: "10", page: "2" });
  });
});
