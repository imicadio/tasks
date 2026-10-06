import { describe, expect, it } from "vitest";
import { formatNominatimAddress } from "../nominatim-address";

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
