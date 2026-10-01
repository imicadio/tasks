import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { RoadAccidentsDashboard } from "../road-accidents-dashboard";

const PROPS = {
  initialTrend: [
    { year: 2023, value: 100 },
    { year: 2024, value: 90 },
  ],
  initialBreakdown: [
    { id: "011200000000", name: "MAŁOPOLSKIE", value: 10 },
    { id: "012400000000", name: "ŚLĄSKIE", value: 20 },
  ],
  initialLatest: { accidents: 90, fatalities: 1896, injured: 20000 },
};

describe("RoadAccidentsDashboard", () => {
  it("renders the headline, KPI tiles, and metric filters", () => {
    render(<RoadAccidentsDashboard {...PROPS} />);

    expect(
      screen.getByRole("heading", { name: /wypadki drogowe w polsce/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1896")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ofiary śmiertelne" }),
    ).toBeInTheDocument();
    expect(screen.getByText("ŚLĄSKIE")).toBeInTheDocument();
  });

  it("has no detectable WCAG violations (axe)", async () => {
    const { container } = render(<RoadAccidentsDashboard {...PROPS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
