import { Input } from "@/shared/ui/input";
import type { StepProps } from "../../types";
import { textFieldHandler } from "../../utils/field-handlers";
import { describedBy } from "../../utils/field-ids";
import { ConsentField } from "./consent-field";
import { Field } from "./field";
import { ReportSummary } from "./report-summary";

export const ContactStep = ({ draft, errors, setField }: StepProps) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="reporterName" label="Imię i nazwisko" error={errors.reporterName}>
            <Input
              id="reporterName"
              value={draft.reporterName}
              autoComplete="name"
              aria-invalid={errors.reporterName ? true : undefined}
              aria-describedby={describedBy("reporterName", false, errors.reporterName)}
              onChange={textFieldHandler(setField, "reporterName")}
            />
          </Field>
        </div>
        <Field id="reporterEmail" label="E-mail" error={errors.reporterEmail}>
          <Input
            id="reporterEmail"
            type="email"
            value={draft.reporterEmail}
            autoComplete="email"
            aria-invalid={errors.reporterEmail ? true : undefined}
            aria-describedby={describedBy("reporterEmail", false, errors.reporterEmail)}
            onChange={textFieldHandler(setField, "reporterEmail")}
          />
        </Field>
        <Field id="reporterPhone" label="Telefon" optional error={errors.reporterPhone}>
          <Input
            id="reporterPhone"
            type="tel"
            value={draft.reporterPhone}
            autoComplete="tel"
            placeholder="600 100 200"
            aria-invalid={errors.reporterPhone ? true : undefined}
            aria-describedby={describedBy("reporterPhone", false, errors.reporterPhone)}
            onChange={textFieldHandler(setField, "reporterPhone")}
          />
        </Field>
      </div>

      <ReportSummary draft={draft} />
      <ConsentField draft={draft} errors={errors} setField={setField} />
    </>
  );
};
