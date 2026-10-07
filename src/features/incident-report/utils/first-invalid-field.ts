import { COORDINATE_FIELDS, LOCATION_ERROR_KEY, STEP_FIELDS } from "../constants";
import type { FormStep, StepErrors } from "../types";

/** Id of the control to focus after a failed step validation: the first
 * invalid field in on-screen order, with the coordinates fieldset
 * (`location`) mapped to its first input. `null` when the step is valid. */
export function firstInvalidFieldId(step: FormStep, errors: StepErrors): string | null {
  const first = STEP_FIELDS[step].find((field) => errors[field]);
  if (!first) return null;
  return first === LOCATION_ERROR_KEY ? COORDINATE_FIELDS[0] : first;
}
