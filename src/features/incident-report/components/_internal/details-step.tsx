import { Input } from "@/shared/ui/input";
import {
  CATEGORY_OPTIONS,
  CONTROL_CLASS,
  SEVERITY_OPTIONS,
} from "../../constants";
import type { StepProps } from "../../types";
import { describedBy } from "../../utils/field-ids";
import { ChoiceGroup } from "./choice-group";
import { Field } from "./field";

export const DetailsStep = ({ draft, errors, setField }: StepProps) => {
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
};
