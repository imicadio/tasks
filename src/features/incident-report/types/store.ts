import type {
  AddressLookupStatus,
  FormStep,
  IncidentDraft,
  SetDraftField,
} from "./form";
import type { Incident } from "./incident";

export type IncidentReportState = {
  draft: IncidentDraft;
  step: FormStep;
  reports: Incident[];
  setField: SetDraftField;
  setLocation: (lat: number, lon: number) => void;
  /** Not persisted — a lookup in flight doesn't survive a refresh. */
  addressLookup: AddressLookupStatus;
  /** Map click: sets the point and fills the address from it. */
  pickLocation: (lat: number, lon: number) => Promise<void>;
  /** Fills `draft.address` from the current coordinates (overwriting it). */
  lookupAddress: () => Promise<void>;
  setStep: (step: FormStep) => void;
  /** Validates the whole draft, stores it as a `new` incident and resets the
   * form. Throws if the draft is invalid — the form validates per step first. */
  submit: (now?: Date) => Incident;
};
