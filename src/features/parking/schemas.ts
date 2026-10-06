import { z } from "zod";
import { apiNullableNumber } from "@/shared/utils/api-validation";

// The source pads some strings (e.g. "ul.Dmowskiego ") — trim, and treat a
// missing value as empty rather than rejecting the whole list over it.
const text = () =>
  z
    .string()
    .nullish()
    .transform((value) => (value ?? "").trim());

/** PARKING_LOTS_URL — static lot metadata. */
export const rawParkingLotsSchema = z.object({
  lastUpdate: z.string(),
  parkingLots: z.array(
    z.object({
      id: z.coerce.string(),
      name: text(),
      shortName: text(),
      address: text(),
      streetEntrance: text(),
      location: z.object({
        latitude: apiNullableNumber(),
        longitude: apiNullableNumber(),
      }),
    }),
  ),
});

/** PARKING_AVAILABILITY_URL — live free-spot counts. */
export const rawParkingAvailabilitySchema = z.object({
  lastUpdate: z.string(),
  parkingLots: z.array(
    z.object({
      parkingId: z.coerce.string(),
      availableSpots: apiNullableNumber(),
      lastUpdate: z.string().nullish(),
    }),
  ),
});

export type RawParkingLots = z.infer<typeof rawParkingLotsSchema>;
export type RawParkingAvailability = z.infer<
  typeof rawParkingAvailabilitySchema
>;
