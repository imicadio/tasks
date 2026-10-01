import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { WeatherStationDetail } from "../weather-station-detail";

const STATION = {
  id: "12500",
  name: "Jelenia Góra",
  measurementDate: "2026-10-01",
  measurementHour: "16",
  temperatureC: 18.5,
  windSpeedMs: 2,
  windDirectionDeg: 100,
  humidityPct: 48.5,
  precipitationMm: 0,
  pressureHpa: 1026,
};

describe("WeatherStationDetail", () => {
  it("shows every raw field as its own stat, including id/date/hour", () => {
    render(<WeatherStationDetail station={STATION} />);

    expect(
      screen.getByRole("heading", { name: "Jelenia Góra" }),
    ).toBeInTheDocument();
    expect(screen.getByText("12500")).toBeInTheDocument();
    expect(screen.getByText("2026-10-01")).toBeInTheDocument();
    expect(screen.getByText("16:00")).toBeInTheDocument();
    expect(screen.getByText("18.5 °C")).toBeInTheDocument();
    expect(screen.getByText("100° (E)")).toBeInTheDocument();
  });

  it("has no detectable WCAG violations (axe)", async () => {
    const { container } = render(<WeatherStationDetail station={STATION} />);
    expect(
      await axe(container, { rules: { "color-contrast": { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
