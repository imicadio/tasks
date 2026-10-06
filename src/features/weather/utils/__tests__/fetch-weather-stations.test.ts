import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWeatherStations } from "../fetch-weather-stations";

describe("fetchWeatherStations", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("requests the proxy with the params as a query string", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], total: 0 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchWeatherStations({ q: "", sort: "name", dir: "asc" });
    expect(fetchMock).toHaveBeenCalledWith("/api/weather?q=&sort=name&dir=asc");
  });

  it("throws a user-facing message on an error status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(
      fetchWeatherStations({ q: "", sort: "name", dir: "asc" }),
    ).rejects.toThrow("Nie udało się pobrać danych pogodowych.");
  });
});
