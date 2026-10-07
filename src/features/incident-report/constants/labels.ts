import type {
  AddressLookupStatus,
  IncidentCategory,
  IncidentSeverity,
  IncidentStatus,
} from "../types";
import {
  ADDRESS_LOOKUP,
  INCIDENT_CATEGORY,
  INCIDENT_SEVERITY,
  INCIDENT_STATUS,
} from "./incident";

export const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  [INCIDENT_CATEGORY.Road]: "Zagrożenie drogowe",
  [INCIDENT_CATEGORY.Infrastructure]: "Awaria infrastruktury",
  [INCIDENT_CATEGORY.Environment]: "Środowisko",
  [INCIDENT_CATEGORY.Safety]: "Bezpieczeństwo publiczne",
};

export const CATEGORY_HINTS: Record<IncidentCategory, string> = {
  [INCIDENT_CATEGORY.Road]: "Wypadek, uszkodzona nawierzchnia, niedziałająca sygnalizacja",
  [INCIDENT_CATEGORY.Infrastructure]: "Woda, prąd, oświetlenie, zalania",
  [INCIDENT_CATEGORY.Environment]: "Odpady, zanieczyszczenia, połamane drzewa",
  [INCIDENT_CATEGORY.Safety]: "Niebezpieczne miejsca, akty wandalizmu",
};

export const SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  [INCIDENT_SEVERITY.Low]: "Niski",
  [INCIDENT_SEVERITY.Medium]: "Średni",
  [INCIDENT_SEVERITY.High]: "Wysoki",
};

export const SEVERITY_COLOR_VAR: Record<IncidentSeverity, string> = {
  [INCIDENT_SEVERITY.Low]: "var(--status-good)",
  [INCIDENT_SEVERITY.Medium]: "var(--status-warning)",
  [INCIDENT_SEVERITY.High]: "var(--status-critical)",
};

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  [INCIDENT_STATUS.New]: "Nowy incydent",
  [INCIDENT_STATUS.Verified]: "Zweryfikowany",
  [INCIDENT_STATUS.InProgress]: "W realizacji",
  [INCIDENT_STATUS.Resolved]: "Rozwiązany",
};

/** Id of the address lookup status line (referenced by aria-describedby). */
export const LOOKUP_STATUS_ID = "address-lookup-status";

/** Status line under the address field while it's filled from the map. */
export const LOOKUP_MESSAGES: Record<AddressLookupStatus, string> = {
  [ADDRESS_LOOKUP.Idle]: "",
  [ADDRESS_LOOKUP.Loading]: "Ustalanie adresu dla wskazanego punktu…",
  [ADDRESS_LOOKUP.Done]: "Adres uzupełniony na podstawie mapy — możesz go poprawić.",
  [ADDRESS_LOOKUP.NotFound]: "Nie znaleziono adresu dla tego punktu — wpisz go ręcznie.",
  [ADDRESS_LOOKUP.Error]: "Nie udało się ustalić adresu — wpisz go ręcznie.",
};
