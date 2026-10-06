import { afterEach, describe, expect, it, vi } from "vitest";
import { getRoadAccidentsPageData } from "../page-data";

vi.mock("../queries", () => ({
  getNationalTrend: vi.fn(async () => [{ year: 2025, value: 100 }]),
  getVoivodeshipBreakdown: vi.fn(async () => [
    { id: "1", name: "ŚLĄSKIE", value: 20 },
  ]),
  getYearValue: vi.fn(async (metric: string) =>
    metric === "injured" ? null : metric.length,
  ),
}));

describe("getRoadAccidentsPageData", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("combines trend, breakdown and each metric's latest value", async () => {
    expect(await getRoadAccidentsPageData()).toEqual({
      trend: [{ year: 2025, value: 100 }],
      breakdown: [{ id: "1", name: "ŚLĄSKIE", value: 20 }],
      latest: { accidents: 9, fatalities: 10, injured: null },
    });
  });
});
