import type { IncidentCategory, IncidentSeverity } from "./incident";

/** The form's in-progress values. Every field starts empty, so the types are
 * looser than `Incident` — the step schemas narrow them on submit. */
export type IncidentDraft = {
  category: IncidentCategory | "";
  severity: IncidentSeverity | "";
  title: string;
  description: string;
  district: string;
  lat: number | null;
  lon: number | null;
  address: string;
  /** `<input type="datetime-local">` value, e.g. "2026-10-05T08:30". */
  occurredAt: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  consent: boolean;
};

export type FormStep = 0 | 1 | 2;

/** Field key → error message. Both `lat` and `lon` report under `location`. */
export type StepErrors = Partial<Record<keyof IncidentDraft | "location", string>>;

/** State of the "fill the address from the map point" lookup. */
export type AddressLookupStatus = "idle" | "loading" | "done" | "not-found" | "error";

/** Sets one draft field, keeping the value's type tied to its key. */
export type SetDraftField = <K extends keyof IncidentDraft>(
  key: K,
  value: IncidentDraft[K],
) => void;

/** A Gdańsk district; picking one drops the pin at its center. */
export type District = { id: string; name: string; lat: number; lon: number };

/** One card in a `ChoiceGroup`. */
export type ChoiceOption<T extends string> = {
  value: T;
  label: string;
  hint?: string;
  swatch?: string;
};

/** A map point as Leaflet takes it: [lat, lon]. */
export type LatLngTuple = [number, number];

/** Props every form step receives from `IncidentForm`. */
export type StepProps = {
  draft: IncidentDraft;
  errors: StepErrors;
  setField: SetDraftField;
};
