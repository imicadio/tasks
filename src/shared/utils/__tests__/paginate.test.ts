import { describe, expect, it } from "vitest";
import { paginate } from "../paginate";

describe("paginate", () => {
  const items = [1, 2, 3, 4, 5];

  it("returns the requested 1-based page with the full total", () => {
    expect(paginate(items, 2, 2)).toEqual({
      data: [3, 4],
      page: 2,
      pageSize: 2,
      total: 5,
    });
  });

  it("returns an empty page past the end", () => {
    expect(paginate(items, 4, 2).data).toEqual([]);
  });
});
