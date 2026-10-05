import { useState } from "react";
import { Input } from "@/shared/ui/input";

/** "54,3812" (Polish decimal comma) and "54.3812" both parse; anything else
 * — including an empty field — is `null`. */
export function parseCoordinate(text: string): number | null {
  const normalized = text.trim().replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/**
 * A free-text coordinate field bound to a numeric value. It keeps its own
 * text so in-between states ("54.", "54,3") don't get reformatted under the
 * cursor, and resyncs only when the value changes from outside (a map
 * click, a district pick).
 */
export function CoordinateInput({
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> & {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const [text, setText] = useState(value === null ? "" : String(value));
  const [syncedValue, setSyncedValue] = useState(value);
  // Adjusting state during render (not in an effect) — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (value !== syncedValue) {
    setSyncedValue(value);
    if (parseCoordinate(text) !== value) setText(value === null ? "" : String(value));
  }
  return (
    <Input
      {...props}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        onChange(parseCoordinate(event.target.value));
      }}
    />
  );
}
