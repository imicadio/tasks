import type {
  Incident,
  IncidentCategory,
  IncidentDraft,
  IncidentSeverity,
  IncidentStatus,
} from "./types";

export const GDANSK_CENTER: [number, number] = [54.372, 18.638];
export const DEFAULT_ZOOM = 12;

/** A generous box around Gdańsk — reports outside it are rejected. */
export const GDANSK_BOUNDS = {
  minLat: 54.27,
  maxLat: 54.45,
  minLon: 18.43,
  maxLon: 18.95,
} as const;

export const STORAGE_KEY = "incident-report:v1";

/** OpenStreetMap's reverse geocoder. Free, no key, but its usage policy asks
 * for an identifying User-Agent and at most ~1 request/s — so it's called
 * only from our own route handler (cached per point), never from the browser.
 * https://operations.osmfoundation.org/policies/nominatim/ */
export const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
export const GEOCODE_USER_AGENT = "NASK-Dashboardy/0.1 (https://github.com/imicadio/NASK)";
/** Addresses don't move; a day of caching per rounded point is plenty. */
export const GEOCODE_REVALIDATE_S = 86_400;
/** Map clicks are rounded to this many decimals (~11 cm) — enough precision,
 * and it keeps the geocode cache keys stable. */
export const COORD_DECIMALS = 6;

/** There is no backend: submitting only writes to localStorage. The short
 * delay keeps the "Wysyłanie…" state visible, as a real request would. */
export const SUBMIT_DELAY_MS = 600;

export const STEPS = [
  { title: "Opis zdarzenia", description: "Co się stało?" },
  { title: "Lokalizacja", description: "Gdzie i kiedy?" },
  { title: "Kontakt i podsumowanie", description: "Kto zgłasza?" },
] as const;

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

/** Picking a district drops the pin at its center — the keyboard-operable
 * alternative to clicking the map (WCAG 2.1.1). */
export const DISTRICTS: { id: string; name: string; lat: number; lon: number }[] = [
  { id: "srodmiescie", name: "Śródmieście", lat: 54.3485, lon: 18.6526 },
  { id: "wrzeszcz", name: "Wrzeszcz", lat: 54.3792, lon: 18.6068 },
  { id: "oliwa", name: "Oliwa", lat: 54.4106, lon: 18.5598 },
  { id: "przymorze", name: "Przymorze", lat: 54.4084, lon: 18.5937 },
  { id: "zaspa", name: "Zaspa", lat: 54.3963, lon: 18.6094 },
  { id: "brzezno", name: "Brzeźno", lat: 54.4097, lon: 18.6273 },
  { id: "orunia", name: "Orunia", lat: 54.3255, lon: 18.6279 },
  { id: "stogi", name: "Stogi", lat: 54.3657, lon: 18.7118 },
  { id: "chelm", name: "Chełm", lat: 54.3341, lon: 18.6206 },
  { id: "jasien", name: "Jasień", lat: 54.3407, lon: 18.5546 },
];

export const EMPTY_DRAFT: IncidentDraft = {
  category: "",
  severity: "",
  title: "",
  description: "",
  district: "",
  lat: null,
  lon: null,
  address: "",
  occurredAt: "",
  reporterName: "",
  reporterEmail: "",
  reporterPhone: "",
  consent: false,
};

/** Hard-coded, made-up incidents so the map isn't empty before the first
 * report. */
export const SEED_INCIDENTS: Incident[] = [
  {
    id: "seed-1",
    reference: "ZGL-20261004-0417",
    title: "Niedziałająca sygnalizacja świetlna",
    description:
      "Na skrzyżowaniu sygnalizator miga na żółto we wszystkich kierunkach, w godzinach szczytu tworzą się korki.",
    category: "road",
    severity: "high",
    status: "in-progress",
    lat: 54.3809,
    lon: 18.6046,
    address: "al. Grunwaldzka / ul. Słowackiego, Wrzeszcz",
    occurredAt: "2026-10-04T07:40:00+02:00",
    reportedAt: "2026-10-04T07:52:00+02:00",
  },
  {
    id: "seed-2",
    reference: "ZGL-20261003-1288",
    title: "Zalana jezdnia po ulewie",
    description:
      "Po nocnej ulewie studzienki nie odbierają wody, prawy pas jest zalany na odcinku ok. 50 m.",
    category: "infrastructure",
    severity: "medium",
    status: "verified",
    lat: 54.3472,
    lon: 18.6489,
    address: "ul. Podwale Przedmiejskie, Śródmieście",
    occurredAt: "2026-10-03T05:15:00+02:00",
    reportedAt: "2026-10-03T06:02:00+02:00",
  },
  {
    id: "seed-3",
    reference: "ZGL-20260929-0063",
    title: "Nielegalne wysypisko odpadów",
    description:
      "Przy ścieżce w parku ktoś porzucił worki z gruzem i stare meble.",
    category: "environment",
    severity: "low",
    status: "resolved",
    lat: 54.3268,
    lon: 18.6322,
    address: "Park Oruński, Orunia",
    occurredAt: "2026-09-28T18:00:00+02:00",
    reportedAt: "2026-09-29T09:21:00+02:00",
  },
];
