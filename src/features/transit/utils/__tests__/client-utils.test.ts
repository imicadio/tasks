import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchVehiclePositions } from "../fetch-vehicle-positions";
import { createVehicleIcon } from "../marker-icon";

describe("fetchVehiclePositions", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("adds the route filter only when one is set", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ lastUpdate: "", vehicles: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchVehiclePositions("");
    await fetchVehiclePositions("148");
    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/transit?");
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/transit?route=148");
  });

  it("throws a user-facing message on an error status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(fetchVehiclePositions("")).rejects.toThrow(
      "Nie udało się pobrać pozycji pojazdów.",
    );
  });
});

describe("createVehicleIcon", () => {
  it("encodes type, heading and selection in the marker markup", () => {
    const html = String(createVehicleIcon(90, "tram", true).options.html);
    expect(html).toContain("transit-marker--tram");
    expect(html).toContain("transit-marker--selected");
    expect(html).toContain("rotate(90deg)");
  });
});
