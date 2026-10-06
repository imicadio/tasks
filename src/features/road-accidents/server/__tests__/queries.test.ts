import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getNationalTrend,
  getVoivodeshipBreakdown,
  getYearValue,
} from "../queries";

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? "OK" : "Internal Server Error",
    json: async () => body,
  } as Response;
}

describe("getNationalTrend", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fills every requested year, using null for years missing from the response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          totalRecords: 1,
          results: [
            {
              id: "000000000000",
              name: "POLSKA",
              values: [{ year: "2021", val: 2245, attrId: 1 }],
            },
          ],
        }),
      ),
    );

    const result = await getNationalTrend("fatalities", 2020, 2022);

    expect(result).toEqual([
      { year: 2020, value: null },
      { year: 2021, value: 2245 },
      { year: 2022, value: null },
    ]);
  });

  it("throws when the GUS API responds with an error status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, false)));

    await expect(getNationalTrend("accidents", 2020, 2020)).rejects.toThrow(
      /GUS BDL request failed/,
    );
  });
});

describe("getVoivodeshipBreakdown", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sorts voivodeships by value, descending", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          totalRecords: 2,
          results: [
            {
              id: "011200000000",
              name: "MAŁOPOLSKIE",
              values: [{ year: "2024", val: 102, attrId: 1 }],
            },
            {
              id: "012400000000",
              name: "ŚLĄSKIE",
              values: [{ year: "2024", val: 155, attrId: 1 }],
            },
          ],
        }),
      ),
    );

    const result = await getVoivodeshipBreakdown("fatalities", 2024);

    expect(result.map((r) => r.name)).toEqual(["ŚLĄSKIE", "MAŁOPOLSKIE"]);
  });
});

describe("getYearValue", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the national value for the requested year", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          totalRecords: 1,
          results: [
            {
              id: "000000000000",
              name: "POLSKA",
              values: [{ year: "2025", val: 1896, attrId: 1 }],
            },
          ],
        }),
      ),
    );

    expect(await getYearValue("fatalities", 2025)).toBe(1896);
  });

  it("returns null when GUS has no data for that year", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ totalRecords: 0, results: [] })),
    );

    expect(await getYearValue("injured", 2025)).toBeNull();
  });
});
