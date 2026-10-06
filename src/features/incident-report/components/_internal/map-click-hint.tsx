import { MousePointerClick } from "lucide-react";

/** Tells the reporter they can pick the location on the map. */
export const MapClickHint = () => {
  return (
    <p className="flex items-start gap-2.5 rounded-lg bg-primary/10 p-3 text-sm text-foreground">
      <MousePointerClick aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>
        <strong className="font-semibold">Kliknij na mapie</strong>, aby
        zaznaczyć miejsce zdarzenia — współrzędne i adres uzupełnią się
        automatycznie. Wszystkie pola możesz też wypełnić ręcznie.
      </span>
    </p>
  );
};
