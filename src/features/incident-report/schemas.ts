import { z } from "zod";
import {
  GDANSK_BOUNDS,
  INCIDENT_CATEGORY,
  INCIDENT_SEVERITY,
  LOCATION_ERROR_KEY,
  LOCATION_REQUIRED,
  OUTSIDE_GDANSK,
  PHONE_RE,
} from "./constants";
import type { FormStep, IncidentDraft, StepErrors } from "./types";
import { isCoordinateField } from "./utils/is-coordinate-field";

export const detailsStepSchema = z.object({
  category: z.enum(INCIDENT_CATEGORY, {
    error: "Wybierz kategorię incydentu.",
  }),
  severity: z.enum(INCIDENT_SEVERITY, {
    error: "Określ poziom zagrożenia.",
  }),
  title: z
    .string()
    .trim()
    .min(5, { error: "Tytuł musi mieć co najmniej 5 znaków." })
    .max(80, { error: "Tytuł może mieć najwyżej 80 znaków." }),
  description: z
    .string()
    .trim()
    .min(20, { error: "Opis musi mieć co najmniej 20 znaków." })
    .max(1000, { error: "Opis może mieć najwyżej 1000 znaków." }),
});

export const locationStepSchema = z.object({
  lat: z
    .number({ error: LOCATION_REQUIRED })
    .min(GDANSK_BOUNDS.minLat, { error: OUTSIDE_GDANSK })
    .max(GDANSK_BOUNDS.maxLat, { error: OUTSIDE_GDANSK }),
  lon: z
    .number({ error: LOCATION_REQUIRED })
    .min(GDANSK_BOUNDS.minLon, { error: OUTSIDE_GDANSK })
    .max(GDANSK_BOUNDS.maxLon, { error: OUTSIDE_GDANSK }),
  address: z
    .string()
    .trim()
    .min(3, { error: "Podaj adres lub opis miejsca (min. 3 znaki)." })
    .max(160, { error: "Adres może mieć najwyżej 160 znaków." }),
  occurredAt: z
    .string()
    .min(1, { error: "Podaj datę i godzinę zdarzenia." })
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      error: "Nieprawidłowa data.",
    })
    .refine((value) => new Date(value).getTime() <= Date.now(), {
      error: "Data zdarzenia nie może być z przyszłości.",
    }),
});

export const contactStepSchema = z.object({
  reporterName: z
    .string()
    .trim()
    .min(2, { error: "Podaj imię i nazwisko." })
    .max(80, { error: "Imię i nazwisko może mieć najwyżej 80 znaków." }),
  reporterEmail: z.email({ error: "Podaj poprawny adres e-mail." }),
  reporterPhone: z
    .string()
    .trim()
    .refine((value) => value === "" || PHONE_RE.test(value), {
      error: "Podaj 9-cyfrowy numer, np. 600 100 200.",
    }),
  consent: z.literal(true, {
    error: "Zgoda jest wymagana, aby wysłać zgłoszenie.",
  }),
});

export const incidentReportSchema = detailsStepSchema
  .extend(locationStepSchema.shape)
  .extend(contactStepSchema.shape);

/** Query of `GET /api/incident-report/geocode`. Limited to Gdańsk so the
 * route can't be used as an open proxy to Nominatim. */
export const geocodeQuerySchema = z.object({
  lat: z.coerce.number().min(GDANSK_BOUNDS.minLat).max(GDANSK_BOUNDS.maxLat),
  lon: z.coerce.number().min(GDANSK_BOUNDS.minLon).max(GDANSK_BOUNDS.maxLon),
});

/** Only the parts of Nominatim's `format=jsonv2` reverse response we use. A
 * point it can't resolve comes back as `{ error: "Unable to geocode" }`. */
export const rawNominatimReverseSchema = z.object({
  display_name: z.string().optional(),
  name: z.string().optional(),
  address: z
    .object({
      road: z.string().optional(),
      pedestrian: z.string().optional(),
      footway: z.string().optional(),
      house_number: z.string().optional(),
      quarter: z.string().optional(),
      suburb: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),
  error: z.string().optional(),
});

export type RawNominatimReverse = z.infer<typeof rawNominatimReverseSchema>;

export type IncidentReportInput = z.infer<typeof incidentReportSchema>;

const STEP_SCHEMAS = [detailsStepSchema, locationStepSchema, contactStepSchema];

/** Validates only the fields that belong to `step`; returns the first error
 * per field (empty object when the step is valid). */
export function validateStep(step: FormStep, draft: IncidentDraft): StepErrors {
  const result = STEP_SCHEMAS[step].safeParse(draft);
  if (result.success) return {};
  const errors: StepErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string") continue;
    const key = isCoordinateField(field) ? LOCATION_ERROR_KEY : field;
    errors[key as keyof StepErrors] ??= issue.message;
  }
  return errors;
}
