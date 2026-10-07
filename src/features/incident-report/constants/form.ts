import type {
  ChoiceOption,
  IncidentCategory,
  IncidentDraft,
  IncidentSeverity,
  StepErrors,
} from "../types";
import {
  CATEGORY_HINTS,
  CATEGORY_LABELS,
  SEVERITY_COLOR_VAR,
  SEVERITY_LABELS,
} from "./labels";
import { INCIDENT_CATEGORY, INCIDENT_SEVERITY } from "./incident";

/** There is no backend: submitting only writes to localStorage. The short
 * delay keeps the "Wysyłanie…" state visible, as a real request would. */
export const SUBMIT_DELAY_MS = 600;

export const STEPS = [
  { title: "Opis zdarzenia", description: "Co się stało?" },
  { title: "Lokalizacja", description: "Gdzie i kiedy?" },
  { title: "Kontakt i podsumowanie", description: "Kto zgłasza?" },
] as const;

export const EMPTY_DRAFT: IncidentDraft = {
  category: "",
  severity: "",
  title: "",
  description: "",
  district: "",
  lat: null,
  lon: null,
  address: "",
  occurredAt: "",
  reporterName: "",
  reporterEmail: "",
  reporterPhone: "",
  consent: false,
};

/** Both coordinates report their errors under this one key — the
 * coordinates fieldset — rather than per input. */
export const LOCATION_ERROR_KEY = "location";

/** Draft fields that make up the location; the first is focused when the
 * location is invalid. */
export const COORDINATE_FIELDS = ["lat", "lon"] as const satisfies readonly (keyof IncidentDraft)[];

/** Focus order for "jump to the first invalid field", per step. */
export const STEP_FIELDS: (keyof StepErrors)[][] = [
  ["category", "severity", "title", "description"],
  [LOCATION_ERROR_KEY, "address", "occurredAt"],
  ["reporterName", "reporterEmail", "reporterPhone", "consent"],
];

/** The last step's index — "Dalej" on earlier steps, "Wyślij" on this one. */
export const LAST_STEP = 2;

export const CATEGORY_OPTIONS: ChoiceOption<IncidentCategory>[] = Object.values(
  INCIDENT_CATEGORY,
).map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
  hint: CATEGORY_HINTS[value],
}));

export const SEVERITY_OPTIONS: ChoiceOption<IncidentSeverity>[] = Object.values(
  INCIDENT_SEVERITY,
).map((value) => ({
  value,
  label: SEVERITY_LABELS[value],
  swatch: SEVERITY_COLOR_VAR[value],
}));

/** Matches the shared `Input` primitive's look, for native textarea/select. */
export const CONTROL_CLASS =
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";
