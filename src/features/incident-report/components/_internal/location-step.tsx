import { Input } from "@/shared/ui/input";
import type { StepProps } from "../../types";
import { textFieldHandler } from "../../utils/field-handlers";
import { describedBy } from "../../utils/field-ids";
import { toDateTimeLocal } from "../../utils/format";
import { AddressField } from "./address-field";
import { CoordinatesFieldset } from "./coordinates-fieldset";
import { Field } from "./field";
import { MapClickHint } from "./map-click-hint";

type Props = StepProps & { onPickDistrict: (districtId: string) => void };

/** Step 2: where (coordinates, address) and when it happened. */
export const LocationStep = ({ draft, errors, setField, onPickDistrict }: Props) => {
  return (
    <>
      <MapClickHint />
      <CoordinatesFieldset
        draft={draft}
        errors={errors}
        setField={setField}
        onPickDistrict={onPickDistrict}
      />
      <AddressField draft={draft} errors={errors} setField={setField} />
      <Field id="occurredAt" label="Data i godzina zdarzenia" error={errors.occurredAt}>
        <Input
          id="occurredAt"
          type="datetime-local"
          value={draft.occurredAt}
          max={toDateTimeLocal(new Date())}
          aria-invalid={errors.occurredAt ? true : undefined}
          aria-describedby={describedBy("occurredAt", false, errors.occurredAt)}
          onChange={textFieldHandler(setField, "occurredAt")}
          className="w-fit"
        />
      </Field>
    </>
  );
};
