import { z } from "zod";
import { sortDirectionSchema } from "@/shared/schemas/sort";
import { SORT_DIRECTION, WEATHER_SORT_FIELD } from "./constants";
import { apiNullableNumber } from "@/shared/utils/api-validation";
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
    measurementDate: raw.data_pomiaru,
    measurementHour:
      raw.godzina_pomiaru === null ? null : String(raw.godzina_pomiaru),
    temperatureC: raw.temperatura,
    windSpeedMs: raw.predkosc_wiatru,
    windDirectionDeg: raw.kierunek_wiatru,
    humidityPct: raw.wilgotnosc_wzgledna,
    precipitationMm: raw.suma_opadu,
    pressureHpa: raw.cisnienie,
  }),
);

export const weatherStationsResponseSchema = z.array(weatherStationSchema);

export const weatherSortFieldSchema = z.enum(WEATHER_SORT_FIELD);

export const weatherQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  sort: weatherSortFieldSchema.optional().default(WEATHER_SORT_FIELD.Temperature),
  dir: sortDirectionSchema.optional().default(SORT_DIRECTION.Desc),
});
