import type { ReactNode } from "react";
import { cn } from "cn";

/** Matches the shared `Input` primitive's look, for native textarea/select. */
export const CONTROL_CLASS =
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

export function errorId(id: string) {
  return `${id}-error`;
}

export function hintId(id: string) {
  return `${id}-hint`;
}

/** `aria-describedby` for a control with an optional hint and error. */
export function describedBy(id: string, hint: boolean, error: string | undefined) {
  return [hint && hintId(id), error && errorId(id)].filter(Boolean).join(" ") || undefined;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(id)} className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground"> (opcjonalnie)</span>
        )}
      </label>
      {hint && (
        <p id={hintId(id)} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      <FieldError id={id} message={error} />
    </div>
  );
}

/** A radio group rendered as selectable cards. Native radios underneath, so
 * arrow-key navigation and the group semantics come for free. */
export function ChoiceGroup<T extends string>({
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
  options: { value: T; label: string; hint?: string; swatch?: string }[];
  error?: string;
  columns?: 2 | 3;
  onChange: (value: T) => void;
}) {
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
}
