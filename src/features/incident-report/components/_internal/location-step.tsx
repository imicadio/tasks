import { LocateFixed, MousePointerClick } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { CONTROL_CLASS, DISTRICTS, LOOKUP_MESSAGES } from "../../constants";
import { useIncidentReportStore } from "../../store";
import type { StepProps } from "../../types";
import { describedBy, errorId, hintId } from "../../utils/field-ids";
import { toDateTimeLocal } from "../../utils/format";
import { CoordinateInput } from "./coordinate-input";
import { Field } from "./field";
import { FieldError } from "./field-error";

export const LocationStep = ({
  draft,
  errors,
  setField,
  onPickDistrict,
}: StepProps & { onPickDistrict: (districtId: string) => void }) => {
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
};
