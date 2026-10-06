import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { STEPS } from "../../constants";
import type { FormStep } from "../../types";

export const Stepper = ({ current }: { current: FormStep }) => {
  return (
    <ol aria-label="Kroki formularza" className="grid grid-cols-3 gap-2">
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step.title}
            aria-current={active ? "step" : undefined}
            className="flex flex-col gap-2"
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-1 rounded-full",
                done || active ? "bg-primary" : "bg-muted",
              )}
            />
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-foreground",
                  !done && !active && "border-input text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    "truncate text-sm",
                    active ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className="sr-only">
                    {`Krok ${index + 1} z ${STEPS.length}: `}
                  </span>
                  {step.title}
                  {done && <span className="sr-only"> (ukończony)</span>}
                </span>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {step.description}
                </span>
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
};
