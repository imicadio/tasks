import { cn } from "@/shared/utils/cn";
import type { ChoiceOption } from "../../types";
import { errorId } from "../../utils/field-ids";
import { FieldError } from "./field-error";

/** A radio group rendered as selectable cards. Native radios underneath, so
 * arrow-key navigation and the group semantics come for free. */
export const ChoiceGroup = <T extends string>({
  id,
  legend,
  name,
  value,
  options,
  error,
  columns = 2,
  onChange,
}: {
  id: string;
  legend: string;
  name: string;
  value: T | "";
  options: ChoiceOption<T>[];
  error?: string;
  columns?: 2 | 3;
  onChange: (value: T) => void;
}) => {
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={error ? errorId(id) : undefined}
      aria-invalid={error ? true : undefined}
      className="flex flex-col gap-2 outline-none"
    >
      <legend className="mb-1.5 text-sm font-medium text-foreground">{legend}</legend>
      <div
        className={cn(
          "grid grid-cols-1 gap-2",
          columns === 2 ? "sm:grid-cols-2" : "grid-cols-3",
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-sm transition-colors",
              "border-input hover:bg-muted/60 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
              "has-[:checked]:border-primary has-[:checked]:bg-primary/5",
              error && "border-destructive/60",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <span className="flex flex-col gap-0.5">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                {option.swatch && (
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: option.swatch }}
                  />
                )}
                {option.label}
              </span>
              {option.hint && (
                <span className="text-xs text-muted-foreground">{option.hint}</span>
              )}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={id} message={error} />
    </fieldset>
  );
};
