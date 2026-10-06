"use client";

import { whenPresent } from "@/shared/utils/when-present";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Props<T extends string> = {
  value: T;
  options: readonly T[];
  getLabel: (option: T) => string;
  onChange: (value: T) => void;
  /** Accessible name — the trigger shows only the current value. */
  ariaLabel: string;
  className?: string;
};

/** A Select over a fixed list of string options with a label for each. */
export const OptionSelect = <T extends string>({
  value,
  options,
  getLabel,
  onChange,
  ariaLabel,
  className,
}: Props<T>) => {
  return (
    <Select value={value} onValueChange={whenPresent(onChange)}>
      <SelectTrigger aria-label={ariaLabel} className={className}>
        <SelectValue>{getLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {getLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
