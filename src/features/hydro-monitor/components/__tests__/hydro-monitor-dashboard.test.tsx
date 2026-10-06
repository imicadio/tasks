import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { HydroMonitorDashboard } from "../hydro-monitor-dashboard";
import { toStationId } from "../../utils/to-station-id";
import type { HydroStation } from "../../types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => "/hydrologia",
  useSearchParams: () => new URLSearchParams(),
}));

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

const STATION: HydroStation = {
  id: toStationId(1),
  name: "Przewoźniki",
  river: "Skroda",
  voivodeship: "LUBUSKIE",
  lon: 14.8,
  lat: 51.5,
  waterLevelCm: 225,
  warningLevelCm: 300,
  alarmLevelCm: 340,
  measuredAt: "2026-09-30 17:20:00",
  status: "normal",
};

const PROPS = {
  initialParams: {
    q: "",
    status: "all" as const,
    voivodeship: "all",
    sort: "status" as const,
    dir: "desc" as const,
  },
  initialData: { data: [STATION], total: 1 },
  voivodeships: ["LUBUSKIE"],
  statusCounts: { alarm: 0, warning: 0, normal: 1, unknown: 0 },
};

describe("HydroMonitorDashboard", () => {
  it("renders the status KPI tiles, filters, and station list", () => {
    renderWithProviders(<HydroMonitorDashboard {...PROPS} />);

    expect(
      screen.getByRole("heading", { name: /monitoring hydrologiczny/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Filtruj według statusu")).toBeInTheDocument();
    expect(screen.getByText("Przewoźniki")).toBeInTheDocument();
  });

  it("has no detectable WCAG violations (axe)", async () => {
    const { container } = renderWithProviders(
      <HydroMonitorDashboard {...PROPS} />,
    );
    // jsdom doesn't do real layout/paint, so axe's color-contrast rule can't
    // run meaningfully here — contrast was verified against the live app in
    // a real browser instead (see docs/decisions/0005-accessibility.md).
    expect(
      await axe(container, { rules: { "color-contrast": { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
