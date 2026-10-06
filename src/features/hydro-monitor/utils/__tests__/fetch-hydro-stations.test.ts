import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchHydroStations } from "../fetch-hydro-stations";

const PARAMS = {
  q: "wisła",
  status: "alarm",
  voivodeship: "all",
  sort: "status",
  dir: "desc",
} as const;

describe("fetchHydroStations", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests the proxy with the params as a query string", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], total: 0 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(await fetchHydroStations(PARAMS)).toEqual({ data: [], total: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/hydro-monitor?q=wis%C5%82a&status=alarm&voivodeship=all&sort=status&dir=desc",
    );
  });

  it("throws a user-facing message on an error status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(fetchHydroStations(PARAMS)).rejects.toThrow(
      "Nie udało się pobrać danych hydrologicznych.",
    );
  });
});
