import { afterEach, describe, expect, it, vi } from "vitest";
import { formatNominatimAddress, reverseGeocode } from "../queries";

describe("formatNominatimAddress", () => {
  it("builds street + number + district", () => {
    expect(
      formatNominatimAddress({
        address: { road: "Długa", house_number: "45", quarter: "Główne Miasto", suburb: "Śródmieście" },
      }),
    ).toBe("Długa 45, Śródmieście");
  });

  it("falls back to a footway, a place name, then display_name", () => {
    expect(formatNominatimAddress({ address: { footway: "Aleja Lipowa" } })).toBe("Aleja Lipowa");
    expect(
      formatNominatimAddress({ name: "Park Oliwski", address: { suburb: "Oliwa" } }),
    ).toBe("Park Oliwski, Oliwa");
    expect(
      formatNominatimAddress({ display_name: "Molo, Brzeźno, Gdańsk, pomorskie, Polska" }),
    ).toBe("Molo, Brzeźno, Gdańsk");
  });

  it("returns null when OSM can't geocode the point", () => {
    expect(formatNominatimAddress({ error: "Unable to geocode" })).toBeNull();
  });
});

describe("reverseGeocode", () => {
  afterEach(() => vi.restoreAllMocks());

  it("queries Nominatim in Polish with an identifying User-Agent", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ address: { road: "Długa", house_number: "45", suburb: "Śródmieście" } }),
    );
    await expect(reverseGeocode(54.3485, 18.6526)).resolves.toEqual({
      address: "Długa 45, Śródmieście",
    });
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.searchParams.get("lat")).toBe("54.3485");
    expect(url.searchParams.get("accept-language")).toBe("pl");
    expect((init.headers as Record<string, string>)["User-Agent"]).toMatch(/Dashboardy/);
  });

  it("throws on an upstream error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 503 }));
    await expect(reverseGeocode(54.35, 18.65)).rejects.toThrow(/503/);
  });
});
