import { describe, expect, it } from "vitest";
import {
  rawParkingAvailabilitySchema,
  rawParkingLotsSchema,
} from "../schemas";

describe("rawParkingLotsSchema", () => {
  it("trims padded strings and coerces ids", () => {
    const parsed = rawParkingLotsSchema.parse({
      lastUpdate: "2026-10-03T03:00:02Z",
      parkingLots: [
        {
          id: 1,
          name: "Galeria Bałtycka",
          shortName: "P01",
          address: "ul.Dmowskiego",
          streetEntrance: "ul.Dmowskiego ",
          location: { latitude: 54.38268, longitude: "18.60024" },
        },
      ],
    });
    expect(parsed.parkingLots[0]).toMatchObject({
      id: "1",
      streetEntrance: "ul.Dmowskiego",
      location: { latitude: 54.38268, longitude: 18.60024 },
    });
  });

  it("tolerates missing text fields and coordinates instead of rejecting the list", () => {
    const parsed = rawParkingLotsSchema.parse({
      lastUpdate: "2026-10-03T03:00:02Z",
      parkingLots: [
        {
          id: "2",
          name: "X",
          shortName: "P02",
          address: null,
          location: { latitude: null, longitude: "" },
        },
      ],
    });
    expect(parsed.parkingLots[0]).toMatchObject({
      address: "",
      streetEntrance: "",
      location: { latitude: null, longitude: null },
    });
  });
});

describe("rawParkingAvailabilitySchema", () => {
  it("coerces parkingId and numeric-string counts", () => {
    const parsed = rawParkingAvailabilitySchema.parse({
      lastUpdate: "2026-10-03T21:58:51Z",
      parkingLots: [
        { parkingId: 1, availableSpots: "869", lastUpdate: "2026-10-03T21:56:39Z" },
      ],
    });
    expect(parsed.parkingLots[0]).toMatchObject({
      parkingId: "1",
      availableSpots: 869,
    });
  });
});
