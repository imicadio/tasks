import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { WeatherDashboard } from "../weather-dashboard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/pogoda",
  useSearchParams: () => new URLSearchParams(),
}));

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const PROPS = {
  initialParams: { q: "", sort: "temperatureC" as const, dir: "desc" as const },
  initialData: {
    data: [
      {
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
      },
    ],
    total: 1,
  },
  summary: {
    avgTemperatureC: 18.5,
    warmest: null,
    coldest: null,
    stationCount: 1,
  },
};

describe("WeatherDashboard", () => {
  it("renders the station table with a clickable row label", () => {
    renderWithProviders(<WeatherDashboard {...PROPS} />);

    expect(
      screen.getByRole("link", { name: "Jelenia Góra" }),
    ).toHaveAttribute("href", "/pogoda/12500");
    expect(screen.getByLabelText("Sortuj wyniki według")).toBeInTheDocument();
  });

  it("has no detectable WCAG violations (axe)", async () => {
    const { container } = renderWithProviders(<WeatherDashboard {...PROPS} />);
    expect(
      await axe(container, { rules: { "color-contrast": { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
