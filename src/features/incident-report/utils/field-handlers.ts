import type { ChangeEvent } from "react";
import type { IncidentDraft, SetDraftField } from "../types";

/** Draft fields whose value is any string (free-text inputs). */
type TextField = {
  [K in keyof IncidentDraft]: string extends IncidentDraft[K] ? K : never;
}[keyof IncidentDraft];

/** Draft fields whose value is a boolean (checkboxes). */
type BooleanField = {
  [K in keyof IncidentDraft]: IncidentDraft[K] extends boolean ? K : never;
}[keyof IncidentDraft];

/** `onChange` for a text input/textarea bound to one draft field. */
export function textFieldHandler(setField: SetDraftField, key: TextField) {
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setField(key, event.target.value);
}

/** `onChange` for a checkbox bound to one draft field. */
export function checkboxFieldHandler(setField: SetDraftField, key: BooleanField) {
  return (event: ChangeEvent<HTMLInputElement>) =>
    setField(key, event.target.checked);
}

/** `onChange` for a control that reports its value directly (radio group,
 * coordinate input) rather than an event. */
export function valueFieldHandler<K extends keyof IncidentDraft>(
  setField: SetDraftField,
  key: K,
) {
  return (value: IncidentDraft[K]) => setField(key, value);
}
