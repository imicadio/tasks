import { describe, expect, it } from "vitest";
import { availabilityStatus, joinAvailability } from "../queries";
import type { RawParkingAvailability, RawParkingLots } from "../../schemas";

const NOW = Date.parse("2026-10-03T22:00:00Z");
const MINUTE = 60_000;
const ago = (ms: number) => new Date(NOW - ms).toISOString();

const LOTS: RawParkingLots = {
  lastUpdate: "2026-10-03T03:00:02Z",
  parkingLots: [
    {
      id: "3",
      name: "PGE Arena",
      shortName: "P03",
      address: "ul. Żaglowa",
      streetEntrance: "ul. Żaglowa",
      location: { latitude: 54.38828, longitude: 18.63675 },
    },
    {
      id: "1",
      name: "Galeria Bałtycka",
      shortName: "P01",
      address: "ul.Dmowskiego",
      streetEntrance: "ul.Dmowskiego",
      location: { latitude: 54.38268, longitude: 18.60024 },
    },
    {
      id: "99",
      name: "Bez lokalizacji",
      shortName: "P99",
      address: "",
      streetEntrance: "",
      location: { latitude: null, longitude: null },
    },
    {
      id: "23",
      name: "Wyspa Spichrzów",
      shortName: "P23",
      address: "ul. Chmielna",
      streetEntrance: "Chmielna",
      location: { latitude: 54.35, longitude: 18.66 },
    },
  ],
};

const AVAILABILITY: RawParkingAvailability = {
  lastUpdate: ago(0),
  parkingLots: [
    { parkingId: "1", availableSpots: 869, lastUpdate: ago(2 * MINUTE) },
    // Real case from the live feed: a lot that stopped reporting days ago.
    { parkingId: "3", availableSpots: 0, lastUpdate: "2026-09-30T00:02:59Z" },
  ],
};

describe("availabilityStatus", () => {
  it("classifies a fresh reading by free-spot count", () => {
    expect(availabilityStatus(869, ago(MINUTE), NOW)).toBe("available");
    expect(availabilityStatus(5, ago(MINUTE), NOW)).toBe("few");
    expect(availabilityStatus(0, ago(MINUTE), NOW)).toBe("full");
  });

  it("never presents a stale reading as current — a days-old 0 is not 'full'", () => {
    expect(availabilityStatus(0, ago(31 * MINUTE), NOW)).toBe("unknown");
  });

  it("is unknown without a count, a timestamp, or with an unparseable one", () => {
    expect(availabilityStatus(null, ago(MINUTE), NOW)).toBe("unknown");
    expect(availabilityStatus(10, null, NOW)).toBe("unknown");
    expect(availabilityStatus(10, "garbage", NOW)).toBe("unknown");
  });
});

describe("joinAvailability", () => {
  const joined = joinAvailability(LOTS, AVAILABILITY, NOW);

  it("joins live counts onto lots by id === parkingId", () => {
    const galeria = joined.find((lot) => lot.id === "1");
    expect(galeria).toMatchObject({
      availableSpots: 869,
      status: "available",
      lat: 54.38268,
      lon: 18.60024,
    });
  });

  it("keeps a stale count but marks it unknown", () => {
    expect(joined.find((lot) => lot.id === "3")).toMatchObject({
      availableSpots: 0,
      availabilityUpdatedAt: "2026-09-30T00:02:59Z",
      status: "unknown",
    });
  });

  it("marks a lot missing from the live feed as unknown with no count", () => {
    expect(joined.find((lot) => lot.id === "23")).toMatchObject({
      availableSpots: null,
      availabilityUpdatedAt: null,
      status: "unknown",
    });
  });

  it("drops lots without coordinates and sorts by lot code", () => {
    expect(joined.map((lot) => lot.shortName)).toEqual(["P01", "P03", "P23"]);
  });
});
