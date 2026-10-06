import { afterEach, describe, expect, it, vi } from "vitest";
import type { ParkingLot } from "../../types";
import { fetchParkingLots } from "../fetch-parking-lots";
import { formatLotName } from "../format";
import { createLotIcon } from "../marker-icon";

const LOT = {
  shortName: "P01",
  name: "Galeria <Bałtycka>",
  availableSpots: 2,
  status: "few",
} as ParkingLot;

describe("fetchParkingLots", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("throws a user-facing message on an error status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(fetchParkingLots()).rejects.toThrow(
      "Nie udało się pobrać danych o parkingach.",
    );
  });
});

describe("formatLotName", () => {
  it("joins the code and the name", () => {
    expect(formatLotName(LOT)).toBe("P01 · Galeria <Bałtycka>");
  });
});

describe("createLotIcon", () => {
  it("shows the count and an escaped, pluralized accessible name", () => {
    const html = String(createLotIcon(LOT, false).options.html);
    expect(html).toContain("parking-marker--few");
    expect(html).toContain("P01 Galeria &lt;Bałtycka&gt;: 2 wolnych miejsca");
    expect(html).toContain('<span aria-hidden="true">2</span>');
  });

  it("shows ? when there's no reading", () => {
    const html = String(
      createLotIcon({ ...LOT, availableSpots: null, status: "unknown" }, true).options.html,
    );
    expect(html).toContain("brak danych");
    expect(html).toContain("parking-marker--selected");
  });
});
