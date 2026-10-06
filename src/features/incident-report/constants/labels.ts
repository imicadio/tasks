import type {
  AddressLookupStatus,
  IncidentCategory,
  IncidentSeverity,
  IncidentStatus,
} from "../types";

export const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  road: "Zagrożenie drogowe",
  infrastructure: "Awaria infrastruktury",
  environment: "Środowisko",
  safety: "Bezpieczeństwo publiczne",
};

export const CATEGORY_HINTS: Record<IncidentCategory, string> = {
  road: "Wypadek, uszkodzona nawierzchnia, niedziałająca sygnalizacja",
  infrastructure: "Woda, prąd, oświetlenie, zalania",
  environment: "Odpady, zanieczyszczenia, połamane drzewa",
  safety: "Niebezpieczne miejsca, akty wandalizmu",
};

export const SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  low: "Niski",
  medium: "Średni",
  high: "Wysoki",
};

export const SEVERITY_COLOR_VAR: Record<IncidentSeverity, string> = {
  low: "var(--status-good)",
  medium: "var(--status-warning)",
  high: "var(--status-critical)",
};

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  new: "Nowy incydent",
  verified: "Zweryfikowany",
  "in-progress": "W realizacji",
  resolved: "Rozwiązany",
};

/** Id of the address lookup status line (referenced by aria-describedby). */
export const LOOKUP_STATUS_ID = "address-lookup-status";

/** Status line under the address field while it's filled from the map. */
export const LOOKUP_MESSAGES: Record<AddressLookupStatus, string> = {
  idle: "",
  loading: "Ustalanie adresu dla wskazanego punktu…",
  done: "Adres uzupełniony na podstawie mapy — możesz go poprawić.",
  "not-found": "Nie znaleziono adresu dla tego punktu — wpisz go ręcznie.",
  error: "Nie udało się ustalić adresu — wpisz go ręcznie.",
};
