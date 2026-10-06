import type { ChangeEvent } from "react";
import { CONTROL_CLASS, DISTRICTS } from "../../constants";
import type { StepProps } from "../../types";
import { valueFieldHandler } from "../../utils/field-handlers";
import { errorId, hintId, joinIds } from "../../utils/field-ids";
import { CoordinateField } from "./coordinate-field";
import { Field } from "./field";
import { FieldError } from "./field-error";

type Props = StepProps & { onPickDistrict: (districtId: string) => void };

/** Latitude/longitude inputs plus the district shortcut — the
 * keyboard-operable alternative to clicking the map (WCAG 2.1.1). */
export const CoordinatesFieldset = ({ draft, errors, setField, onPickDistrict }: Props) => {
  const coordsDescribedBy = joinIds(hintId("coordinates"), errors.location && errorId("location"));
  const handleDistrictChange = (event: ChangeEvent<HTMLSelectElement>) =>
    onPickDistrict(event.target.value);

  return (
    <fieldset
      aria-describedby={coordsDescribedBy}
      className="flex flex-col gap-3 rounded-lg border border-dashed border-input p-3"
    >
      <legend className="px-1 text-sm font-medium text-foreground">
        Współrzędne miejsca
      </legend>
      <p id={hintId("coordinates")} className="text-xs text-muted-foreground">
        Stopnie dziesiętne, np. 54.34850 i 18.65260. Zamiast klikania możesz
        wybrać dzielnicę — punkt trafi do jej centrum.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CoordinateField
          id="lat"
          label="Szerokość geograficzna"
          placeholder="54.34850"
          value={draft.lat}
          invalid={Boolean(errors.location)}
          describedBy={coordsDescribedBy}
          onChange={valueFieldHandler(setField, "lat")}
        />
        <CoordinateField
          id="lon"
          label="Długość geograficzna"
          placeholder="18.65260"
          value={draft.lon}
          invalid={Boolean(errors.location)}
          describedBy={coordsDescribedBy}
          onChange={valueFieldHandler(setField, "lon")}
        />
      </div>
      <Field id="district" label="Dzielnica (szybki wybór)">
        <select
          id="district"
          value={draft.district}
          onChange={handleDistrictChange}
          className={`${CONTROL_CLASS} h-8 py-1`}
        >
          <option value="">— wybierz —</option>
          {DISTRICTS.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </Field>
      <FieldError id="location" message={errors.location} />
    </fieldset>
  );
};
