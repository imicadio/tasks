import { LocateFixed, MousePointerClick } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  CATEGORY_HINTS,
  CATEGORY_LABELS,
  DISTRICTS,
  SEVERITY_COLOR_VAR,
  SEVERITY_LABELS,
} from "../../constants";
import { formatDateTime, toDateTimeLocal } from "../../lib/format";
import { useIncidentReportStore } from "../../store";
import type {
  AddressLookupStatus,
  IncidentCategory,
  IncidentDraft,
  IncidentSeverity,
  StepErrors,
} from "../../types";
import {
  CONTROL_CLASS,
  ChoiceGroup,
  Field,
  FieldError,
  describedBy,
  errorId,
  hintId,
} from "./fields";
import { CoordinateInput } from "./coordinate-input";

type StepProps = {
  draft: IncidentDraft;
  errors: StepErrors;
  setField: <K extends keyof IncidentDraft>(key: K, value: IncidentDraft[K]) => void;
};

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as IncidentCategory[]).map(
  (value) => ({ value, label: CATEGORY_LABELS[value], hint: CATEGORY_HINTS[value] }),
);

const SEVERITY_OPTIONS = (Object.keys(SEVERITY_LABELS) as IncidentSeverity[]).map(
  (value) => ({ value, label: SEVERITY_LABELS[value], swatch: SEVERITY_COLOR_VAR[value] }),
);

export function DetailsStep({ draft, errors, setField }: StepProps) {
  return (
    <>
      <ChoiceGroup
        id="category"
        legend="Kategoria incydentu"
        name="category"
        value={draft.category}
        options={CATEGORY_OPTIONS}
        error={errors.category}
        onChange={(value) => setField("category", value)}
      />
      <ChoiceGroup
        id="severity"
        legend="Poziom zagrożenia"
        name="severity"
        value={draft.severity}
        options={SEVERITY_OPTIONS}
        error={errors.severity}
        columns={3}
        onChange={(value) => setField("severity", value)}
      />
      <Field id="title" label="Tytuł zgłoszenia" error={errors.title}>
        <Input
          id="title"
          value={draft.title}
          maxLength={80}
          placeholder="np. Uszkodzona latarnia przy przejściu"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={describedBy("title", false, errors.title)}
          onChange={(event) => setField("title", event.target.value)}
        />
      </Field>
      <Field
        id="description"
        label="Opis"
        hint="Co dokładnie się stało, czy ktoś jest w niebezpieczeństwie? Min. 20 znaków."
        error={errors.description}
      >
        <textarea
          id="description"
          rows={5}
          value={draft.description}
          maxLength={1000}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={describedBy("description", true, errors.description)}
          onChange={(event) => setField("description", event.target.value)}
          className={CONTROL_CLASS}
        />
        <span className="self-end text-xs tabular-nums text-muted-foreground">
          {draft.description.length} / 1000
        </span>
      </Field>
    </>
  );
}

const LOOKUP_MESSAGES: Record<AddressLookupStatus, string> = {
  idle: "",
  loading: "Ustalanie adresu dla wskazanego punktu…",
  done: "Adres uzupełniony na podstawie mapy — możesz go poprawić.",
  "not-found": "Nie znaleziono adresu dla tego punktu — wpisz go ręcznie.",
  error: "Nie udało się ustalić adresu — wpisz go ręcznie.",
};

export function LocationStep({
  draft,
  errors,
  setField,
  onPickDistrict,
}: StepProps & { onPickDistrict: (districtId: string) => void }) {
  const addressLookup = useIncidentReportStore((state) => state.addressLookup);
  const lookupAddress = useIncidentReportStore((state) => state.lookupAddress);
  const hasPoint = draft.lat !== null && draft.lon !== null;
  const coordsDescribedBy = [hintId("coordinates"), errors.location && errorId("location")]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <p className="flex items-start gap-2.5 rounded-lg bg-primary/10 p-3 text-sm text-foreground">
        <MousePointerClick aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>
          <strong className="font-semibold">Kliknij na mapie</strong>, aby
          zaznaczyć miejsce zdarzenia — współrzędne i adres uzupełnią się
          automatycznie. Wszystkie pola możesz też wypełnić ręcznie.
        </span>
      </p>

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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lat" className="text-sm text-foreground">
              Szerokość geograficzna
            </label>
            <CoordinateInput
              id="lat"
              value={draft.lat}
              placeholder="54.34850"
              aria-invalid={errors.location ? true : undefined}
              aria-describedby={coordsDescribedBy}
              onChange={(value) => setField("lat", value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lon" className="text-sm text-foreground">
              Długość geograficzna
            </label>
            <CoordinateInput
              id="lon"
              value={draft.lon}
              placeholder="18.65260"
              aria-invalid={errors.location ? true : undefined}
              aria-describedby={coordsDescribedBy}
              onChange={(value) => setField("lon", value)}
            />
          </div>
        </div>
        <Field id="district" label="Dzielnica (szybki wybór)">
          <select
            id="district"
            value={draft.district}
            onChange={(event) => onPickDistrict(event.target.value)}
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
            aria-describedby={[
              hintId("address"),
              errors.address && errorId("address"),
              "address-lookup-status",
            ]
              .filter(Boolean)
              .join(" ")}
            onChange={(event) => setField("address", event.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!hasPoint || addressLookup === "loading"}
            onClick={() => void lookupAddress()}
            className="sm:h-8"
          >
            <LocateFixed data-icon="inline-start" aria-hidden="true" />
            Uzupełnij adres ze współrzędnych
          </Button>
        </div>
        <p
          id="address-lookup-status"
          role="status"
          className="min-h-4 text-xs text-muted-foreground"
        >
          {LOOKUP_MESSAGES[addressLookup]}
        </p>
      </Field>

      <Field id="occurredAt" label="Data i godzina zdarzenia" error={errors.occurredAt}>
        <Input
          id="occurredAt"
          type="datetime-local"
          value={draft.occurredAt}
          max={toDateTimeLocal(new Date())}
          aria-invalid={errors.occurredAt ? true : undefined}
          aria-describedby={describedBy("occurredAt", false, errors.occurredAt)}
          onChange={(event) => setField("occurredAt", event.target.value)}
          className="w-fit"
        />
      </Field>
    </>
  );
}

export function ContactStep({ draft, errors, setField }: StepProps) {
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
            {draft.category ? CATEGORY_LABELS[draft.category] : "—"}
          </dd>
          <dt className="text-muted-foreground">Zagrożenie</dt>
          <dd className="text-foreground">
            {draft.severity ? SEVERITY_LABELS[draft.severity] : "—"}
          </dd>
          <dt className="text-muted-foreground">Tytuł</dt>
          <dd className="text-foreground">{draft.title || "—"}</dd>
          <dt className="text-muted-foreground">Miejsce</dt>
          <dd className="text-foreground">
            {draft.address || "—"}
            {district && `, ${district.name}`}
          </dd>
          <dt className="text-muted-foreground">Kiedy</dt>
          <dd className="text-foreground">
            {draft.occurredAt ? formatDateTime(draft.occurredAt) : "—"}
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
}
