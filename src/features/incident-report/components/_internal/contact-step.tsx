import { Input } from "@/shared/ui/input";
import {
  CATEGORY_LABELS,
  DISTRICTS,
  MISSING_VALUE,
  SEVERITY_LABELS,
} from "../../constants";
import type { StepProps } from "../../types";
import { describedBy, errorId } from "../../utils/field-ids";
import { formatDateTime } from "../../utils/format";
import { Field } from "./field";
import { FieldError } from "./field-error";

export const ContactStep = ({ draft, errors, setField }: StepProps) => {
  const district = DISTRICTS.find((d) => d.id === draft.district);
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
              onChange={(event) => setField("reporterName", event.target.value)}
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
            onChange={(event) => setField("reporterEmail", event.target.value)}
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
            onChange={(event) => setField("reporterPhone", event.target.value)}
          />
        </Field>
      </div>

      <section aria-labelledby="summary-heading" className="rounded-lg bg-muted/50 p-4">
        <h3 id="summary-heading" className="mb-3 text-sm font-semibold text-foreground">
          Podsumowanie zgłoszenia
        </h3>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Kategoria</dt>
          <dd className="text-foreground">
            {draft.category ? CATEGORY_LABELS[draft.category] : MISSING_VALUE}
          </dd>
          <dt className="text-muted-foreground">Zagrożenie</dt>
          <dd className="text-foreground">
            {draft.severity ? SEVERITY_LABELS[draft.severity] : MISSING_VALUE}
          </dd>
          <dt className="text-muted-foreground">Tytuł</dt>
          <dd className="text-foreground">{draft.title || MISSING_VALUE}</dd>
          <dt className="text-muted-foreground">Miejsce</dt>
          <dd className="text-foreground">
            {draft.address || MISSING_VALUE}
            {district && `, ${district.name}`}
          </dd>
          <dt className="text-muted-foreground">Kiedy</dt>
          <dd className="text-foreground">
            {draft.occurredAt ? formatDateTime(draft.occurredAt) : MISSING_VALUE}
          </dd>
        </dl>
      </section>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-2.5 text-sm text-foreground">
          <input
            id="consent"
            type="checkbox"
            checked={draft.consent}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? errorId("consent") : undefined}
            onChange={(event) => setField("consent", event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>
            Potwierdzam, że podane informacje są prawdziwe, i zgadzam się na
            kontakt w sprawie zgłoszenia.
          </span>
        </label>
        <FieldError id="consent" message={errors.consent} />
      </div>
    </>
  );
};
