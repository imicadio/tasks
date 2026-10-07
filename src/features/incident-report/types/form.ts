import type { ValueOf } from "@/shared/types/value-of";
import type {
  ADDRESS_LOOKUP,
  COORDINATE_FIELDS,
  LOCATION_ERROR_KEY,
} from "../constants";
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

/** Field key → error message. Both coordinates report under
 * LOCATION_ERROR_KEY. */
export type StepErrors = Partial<Record<keyof IncidentDraft | typeof LOCATION_ERROR_KEY, string>>;

export type AddressLookupStatus = ValueOf<typeof ADDRESS_LOOKUP>;

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

/** A coordinate draft field (`lat` or `lon`). */
export type CoordinateField = (typeof COORDINATE_FIELDS)[number];
