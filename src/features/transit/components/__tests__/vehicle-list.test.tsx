import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { VehicleList } from "../vehicle-list";
import type { Vehicle } from "../../types";

const VEHICLES: Vehicle[] = [
  {
    id: 1 as Vehicle["id"],
    routeId: 3,
    routeShortName: "3",
    vehicleType: "tram",
    headsign: "Brzeźno",
    vehicleCode: "1014",
    lat: 54.34,
    lon: 18.63,
    speedKmh: 25,
    direction: 90,
    delaySeconds: -114,
    generatedAt: "2026-10-03T15:27:20Z",
  },
  {
    id: 2 as Vehicle["id"],
    routeId: 148,
    routeShortName: "148",
    vehicleType: "bus",
    headsign: "Nowy Port",
    vehicleCode: "3316",
    lat: 54.39,
    lon: 18.67,
    speedKmh: 0,
    direction: 180,
    delaySeconds: 200,
    generatedAt: "2026-10-03T15:27:16Z",
  },
];

describe("VehicleList", () => {
  it("renders one entry per vehicle with route, destination, and delay", () => {
    render(
      <VehicleList
        vehicles={VEHICLES}
        selectedVehicleId={null}
        onSelectVehicle={vi.fn()}
      />,
    );

    expect(screen.getByText("Brzeźno")).toBeInTheDocument();
    expect(screen.getByText("Nowy Port")).toBeInTheDocument();
    expect(screen.getByText(/\+3 min/)).toBeInTheDocument();
  });

  it("exposes each vehicle's type as text, not color alone", () => {
    render(
      <VehicleList
        vehicles={VEHICLES}
        selectedVehicleId={null}
        onSelectVehicle={vi.fn()}
      />,
    );
    expect(screen.getByText("Tramwaj")).toBeInTheDocument();
    expect(screen.getByText("Autobus")).toBeInTheDocument();
  });

  it("shows an empty-state message when the filter matches nothing", () => {
    render(
      <VehicleList vehicles={[]} selectedVehicleId={null} onSelectVehicle={vi.fn()} />,
    );
    expect(screen.getByText(/brak pojazdów/i)).toBeInTheDocument();
  });

  it("has no detectable WCAG violations (axe)", async () => {
    const { container } = render(
      <VehicleList
        vehicles={VEHICLES}
        selectedVehicleId={VEHICLES[0].id}
        onSelectVehicle={vi.fn()}
      />,
    );
    expect(
      await axe(container, { rules: { "color-contrast": { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
