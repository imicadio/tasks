import { z } from "zod";
import { apiNullableNumber } from "@/shared/lib/api-validation";
import type { WeatherStation } from "./types";

// Raw shape of https://danepubliczne.imgw.pl/api/data/synop. Same
// inconsistent-typing caveat as the hydro feed applies here too, so every
// numeric field goes through apiNullableNumber rather than z.number().
const rawSynopStationSchema = z.object({
  id_stacji: z.coerce.number(),
  stacja: z.string(),
  data_pomiaru: z.string().nullable(),
  godzina_pomiaru: z.union([z.string(), z.number()]).nullable(),
  temperatura: apiNullableNumber(),
  predkosc_wiatru: apiNullableNumber(),
  kierunek_wiatru: apiNullableNumber(),
  wilgotnosc_wzgledna: apiNullableNumber(),
  suma_opadu: apiNullableNumber(),
  cisnienie: apiNullableNumber(),
});

export const weatherStationSchema = rawSynopStationSchema.transform(
  (raw): WeatherStation => ({
    id: String(raw.id_stacji),
    name: raw.stacja,
    measuredAt:
      raw.data_pomiaru && raw.godzina_pomiaru !== null
        ? `${raw.data_pomiaru} ${raw.godzina_pomiaru}:00`
        : raw.data_pomiaru,
    temperatureC: raw.temperatura,
    windSpeedMs: raw.predkosc_wiatru,
    windDirectionDeg: raw.kierunek_wiatru,
    humidityPct: raw.wilgotnosc_wzgledna,
    precipitationMm: raw.suma_opadu,
    pressureHpa: raw.cisnienie,
  }),
);

export const weatherStationsResponseSchema = z.array(weatherStationSchema);

export const weatherSortFieldSchema = z.enum([
  "name",
  "temperatureC",
  "windSpeedMs",
]);
export const sortDirectionSchema = z.enum(["asc", "desc"]);

export const weatherQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  sort: weatherSortFieldSchema.optional().default("temperatureC"),
  dir: sortDirectionSchema.optional().default("desc"),
});
