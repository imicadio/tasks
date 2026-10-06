import type { StepProps } from "../../types";
import { checkboxFieldHandler } from "../../utils/field-handlers";
import { errorId } from "../../utils/field-ids";
import { FieldError } from "./field-error";

/** The required "information is true, you may contact me" checkbox. */
export const ConsentField = ({ draft, errors, setField }: StepProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-start gap-2.5 text-sm text-foreground">
        <input
          id="consent"
          type="checkbox"
          checked={draft.consent}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? errorId("consent") : undefined}
          onChange={checkboxFieldHandler(setField, "consent")}
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span>
          Potwierdzam, że podane informacje są prawdziwe, i zgadzam się na
          kontakt w sprawie zgłoszenia.
        </span>
      </label>
      <FieldError id="consent" message={errors.consent} />
    </div>
  );
};
