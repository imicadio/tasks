import { z } from "zod";
import { apiNullableNumber } from "@/shared/utils/api-validation";
import type { Direction, Vehicle, VehiclesSnapshot, VehicleType } from "./types";

/** Snaps an arbitrary bearing to the nearest of the 8 compass points the
 * source system itself uses, rather than trusting it's already one of
 * them — defensive, since a single unexpected value shouldn't be able to
 * crash parsing of the other ~200 vehicles in the same response. */
export function normalizeDirection(deg: number): Direction {
  const normalized = ((deg % 360) + 360) % 360;
  const snapped = (Math.round(normalized / 45) * 45) % 360;
  return snapped as Direction;
}

const rawVehicleSchema = z.object({
  vehicleId: z.coerce.number(),
  routeId: z.coerce.number(),
  routeShortName: z.string(),
  headsign: z.string().nullable(),
  vehicleCode: z.string(),
  lat: apiNullableNumber(),
  lon: apiNullableNumber(),
  speed: apiNullableNumber(),
  direction: apiNullableNumber(),
  delay: apiNullableNumber(),
  generated: z.string(),
});

const rawSnapshotSchema = z.object({
  lastUpdate: z.string(),
  vehicles: z.array(rawVehicleSchema),
});

export const vehiclesSnapshotSchema = rawSnapshotSchema.transform(
  (raw): VehiclesSnapshot => ({
    lastUpdate: raw.lastUpdate,
    // A vehicle with no position isn't placeable on the map — drop it
    // rather than fabricate a (0, 0) coordinate.
    vehicles: raw.vehicles
      .filter(
        (v): v is typeof v & { lat: number; lon: number } =>
          v.lat !== null && v.lon !== null,
      )
      .map(
        (v): Vehicle => ({
          id: v.vehicleId as Vehicle["id"],
          routeId: v.routeId,
          routeShortName: v.routeShortName,
          // Enriched from the routes feed in server/queries.ts, which has
          // the routeId → type mapping this schema doesn't have access to
          // — "other" here is only ever a transient default, never what a
          // caller of getVehiclePositions() actually sees.
          vehicleType: "other",
          headsign: v.headsign ?? "",
          vehicleCode: v.vehicleCode,
          lat: v.lat,
          lon: v.lon,
          speedKmh: v.speed ?? 0,
          direction: normalizeDirection(v.direction ?? 0),
          delaySeconds: v.delay ?? 0,
          generatedAt: v.generated,
        }),
      ),
  }),
);

export const transitQuerySchema = z.object({
  route: z.string().trim().max(20).optional().default(""),
});

function toVehicleType(raw: string): VehicleType {
  if (raw === "BUS") return "bus";
  if (raw === "TRAM") return "tram";
  return "other";
}

// ZTM Gdańsk's "Lista linii" resource — keyed by date (normally just
// today's), each holding the full route list for that day.
const rawRoutesFileSchema = z.record(
  z.string(),
  z.object({
    lastUpdate: z.string(),
    routes: z.array(
      z.object({
        routeId: z.coerce.number(),
        routeType: z.string(),
      }),
    ),
  }),
);

/** Parses the routes feed straight into a routeId → VehicleType lookup —
 * nothing else in this feature needs the rest of its fields. */
export const routeTypeMapSchema = rawRoutesFileSchema.transform((raw) => {
  const map = new Map<number, VehicleType>();
  for (const day of Object.values(raw)) {
    for (const route of day.routes) {
      map.set(route.routeId, toVehicleType(route.routeType));
    }
  }
  return map;
});
