import { describe, expect, it } from "vitest";
import {
  breakdownQuerySchema,
  gusByVariableResponseSchema,
  trendQuerySchema,
} from "../schemas";

describe("gusByVariableResponseSchema", () => {
  it("parses a real-shaped GUS BDL response", () => {
    const sample = {
      totalRecords: 1,
      results: [
        {
          id: "000000000000",
          name: "POLSKA",
          values: [
            { year: "2023", val: 1893, attrId: 1 },
            { year: "2024", val: 1896, attrId: 1 },
          ],
        },
      ],
    };
    expect(() => gusByVariableResponseSchema.parse(sample)).not.toThrow();
  });

  it("rejects a response missing required fields", () => {
    expect(() =>
      gusByVariableResponseSchema.parse({ results: [{ id: "x" }] }),
    ).toThrow();
  });
});

describe("trendQuerySchema", () => {
  it("applies defaults for page/pageSize", () => {
    const parsed = trendQuerySchema.parse({ metric: "accidents" });
    expect(parsed).toEqual({ metric: "accidents", page: 1, pageSize: 15 });
  });

  it("rejects an unknown metric", () => {
    expect(() => trendQuerySchema.parse({ metric: "bogus" })).toThrow();
  });
});

describe("breakdownQuerySchema", () => {
  it("coerces year from a query string", () => {
    const parsed = breakdownQuerySchema.parse({
      metric: "fatalities",
      year: "2024",
    });
    expect(parsed).toEqual({ metric: "fatalities", year: 2024 });
  });

  it("rejects a year outside the supported range", () => {
    expect(() =>
      breakdownQuerySchema.parse({ metric: "fatalities", year: "1900" }),
    ).toThrow();
  });
});
