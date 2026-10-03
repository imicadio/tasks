import { fireEvent, render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { ParkingTable } from "../parking-table";
import type { ParkingLot } from "../../types";

const LOTS: ParkingLot[] = [
  {
    id: "1" as ParkingLot["id"],
    name: "Galeria Bałtycka",
    shortName: "P01",
    address: "ul.Dmowskiego",
    streetEntrance: "ul.Dmowskiego",
    lat: 54.38268,
    lon: 18.60024,
    availableSpots: 869,
    availabilityUpdatedAt: "2026-10-03T21:56:39Z",
    status: "available",
  },
  {
    id: "3" as ParkingLot["id"],
    name: "PGE Arena",
    shortName: "P03",
    address: "ul. Żaglowa",
    streetEntrance: "ul. Żaglowa",
    lat: 54.38828,
    lon: 18.63675,
    availableSpots: 0,
    availabilityUpdatedAt: "2026-09-30T00:02:59Z",
    status: "unknown",
  },
];

describe("ParkingTable", () => {
  it("renders a captioned table with one row per lot", () => {
    render(
      <ParkingTable lots={LOTS} selectedLotId={null} onSelectLot={() => {}} />,
    );
    const table = screen.getByRole("table", {
      name: /parkingi w gdańsku i liczba wolnych miejsc/i,
    });
    // header row + 2 lots
    expect(within(table).getAllByRole("row")).toHaveLength(3);
    const galeria = screen.getByRole("row", { name: /galeria bałtycka/i });
    expect(within(galeria).getByText("869")).toBeInTheDocument();
    expect(within(galeria).getByText("Wolne miejsca")).toBeInTheDocument();
  });

  it("labels a stale count as not current instead of showing a bare 0", () => {
    render(
      <ParkingTable lots={LOTS} selectedLotId={null} onSelectLot={() => {}} />,
    );
    const arena = screen.getByRole("row", { name: /pge arena/i });
    expect(within(arena).getByText("0 (nieaktualne)")).toBeInTheDocument();
    expect(
      within(arena).getByText("Brak aktualnych danych"),
    ).toBeInTheDocument();
  });

  it("selects a lot from its named map button and reflects it with aria-pressed", () => {
    const onSelectLot = vi.fn();
    const { rerender } = render(
      <ParkingTable lots={LOTS} selectedLotId={null} onSelectLot={onSelectLot} />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Pokaż na mapie: PGE Arena" }),
    );
    expect(onSelectLot).toHaveBeenCalledWith("3");

    rerender(
      <ParkingTable lots={LOTS} selectedLotId={LOTS[1].id} onSelectLot={onSelectLot} />,
    );
    expect(
      screen.getByRole("button", { name: "Pokaż na mapie: PGE Arena" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <ParkingTable lots={LOTS} selectedLotId={LOTS[0].id} onSelectLot={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
