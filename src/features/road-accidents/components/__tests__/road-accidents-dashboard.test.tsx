import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoadAccidentsDashboard } from "../road-accidents-dashboard";

describe("RoadAccidentsDashboard", () => {
  it("renders the headline, KPI tiles, and metric filters", () => {
    render(
      <RoadAccidentsDashboard
        initialTrend={[
          { year: 2023, value: 100 },
          { year: 2024, value: 90 },
        ]}
        initialBreakdown={[
          { id: "011200000000", name: "MAŁOPOLSKIE", value: 10 },
          { id: "012400000000", name: "ŚLĄSKIE", value: 20 },
        ]}
        initialLatest={{ accidents: 90, fatalities: 1896, injured: 20000 }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /wypadki drogowe w polsce/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1896")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ofiary śmiertelne" }),
    ).toBeInTheDocument();
    expect(screen.getByText("ŚLĄSKIE")).toBeInTheDocument();
  });
});
