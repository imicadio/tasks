import { LocateFixed } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { LOOKUP_MESSAGES, LOOKUP_STATUS_ID } from "../../constants";
import { useIncidentReportStore } from "../../store";
import type { StepProps } from "../../types";
import { textFieldHandler } from "../../utils/field-handlers";
import { errorId, hintId, joinIds } from "../../utils/field-ids";
import { draftPoint } from "../../utils/draft";
import { Field } from "./field";

/** Address text, filled from the map point on demand or typed by hand. */
export const AddressField = ({ draft, errors, setField }: StepProps) => {
  const addressLookup = useIncidentReportStore((state) => state.addressLookup);
  const lookupAddress = useIncidentReportStore((state) => state.lookupAddress);
  const handleLookupClick = () => void lookupAddress();
  const canLookup = draftPoint(draft) !== null && addressLookup !== "loading";

  return (
    <Field
      id="address"
      label="Adres lub opis miejsca"
      hint="Uzupełnia się po kliknięciu na mapie. Możesz go wpisać lub poprawić ręcznie."
      error={errors.address}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="address"
          value={draft.address}
          maxLength={160}
          autoComplete="off"
          placeholder="np. Długa 45, Śródmieście"
          aria-invalid={errors.address ? true : undefined}
          aria-describedby={joinIds(
            hintId("address"),
            errors.address && errorId("address"),
            LOOKUP_STATUS_ID,
          )}
          onChange={textFieldHandler(setField, "address")}
        />
        <Button
          type="button"
          variant="outline"
          disabled={!canLookup}
          onClick={handleLookupClick}
          className="sm:h-8"
        >
          <LocateFixed data-icon="inline-start" aria-hidden="true" />
          Uzupełnij adres ze współrzędnych
        </Button>
      </div>
      <p id={LOOKUP_STATUS_ID} role="status" className="min-h-4 text-xs text-muted-foreground">
        {LOOKUP_MESSAGES[addressLookup]}
      </p>
    </Field>
  );
};
