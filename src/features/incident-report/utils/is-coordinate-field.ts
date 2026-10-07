import { COORDINATE_FIELDS } from "../constants";

/** Whether a draft field is one of the coordinates (`lat`/`lon`). */
export function isCoordinateField(field: string): boolean {
  return (COORDINATE_FIELDS as readonly string[]).includes(field);
}
