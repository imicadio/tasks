import { z } from "zod";
import { apiNullableNumber } from "@/shared/utils/api-validation";
import { deriveStationStatus, toStationId } from "./types";
import type { HydroStation } from "./types";

// IMGW's hydro feed is NOT uniformly typed across its own ~900 records: most
// numeric fields come back as JSON numbers, but a meaningful minority of
// records (observed e.g. around index 911-912 of the live response) return
// the exact same fields as numeric strings instead ("151140030" vs
// 151140030). A schema using plain z.number() parses the first few dozen
// records fine and then throws deep into the array in production. See
// docs/decisions/0003-api-data-validation.md.
const rawHydroStationSchema = z.object({
  id_stacji: z.coerce.number(),
  stacja: z.string(),
  rzeka: z.string().nullable(),
  wojewodztwo: z.string().nullable(),
  lon: apiNullableNumber(),
  lat: apiNullableNumber(),
  stan_wody: apiNullableNumber(),
  stan_wody_data_pomiaru: z.string().nullable(),
  stan_ostrzegawczy: apiNullableNumber(),
  stan_alarmowy: apiNullableNumber(),
});

// The anti-corruption layer: validates the raw wire shape, then maps it
// onto our own domain type so nothing outside this file ever has to know
// the IMGW field names or reason about raw thresholds again.
export const hydroStationSchema = rawHydroStationSchema.transform(
  (raw): HydroStation => ({
    id: toStationId(raw.id_stacji),
    name: raw.stacja,
    river: raw.rzeka ?? "—",
    voivodeship: raw.wojewodztwo ?? "—",
    lon: raw.lon ?? 0,
    lat: raw.lat ?? 0,
    waterLevelCm: raw.stan_wody,
    warningLevelCm: raw.stan_ostrzegawczy,
    alarmLevelCm: raw.stan_alarmowy,
    measuredAt: raw.stan_wody_data_pomiaru,
    status: deriveStationStatus(
      raw.stan_wody,
      raw.stan_ostrzegawczy,
      raw.stan_alarmowy,
    ),
  }),
);

export const hydroStationsResponseSchema = z.array(hydroStationSchema);

export const statusFilterSchema = z.enum([
  "all",
  "alarm",
  "warning",
  "normal",
  "unknown",
]);

export const sortFieldSchema = z.enum(["name", "waterLevelCm", "status"]);
export const sortDirectionSchema = z.enum(["asc", "desc"]);

export const hydroQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  status: statusFilterSchema.optional().default("all"),
  voivodeship: z.string().optional().default("all"),
  sort: sortFieldSchema.optional().default("status"),
  dir: sortDirectionSchema.optional().default("desc"),
});
