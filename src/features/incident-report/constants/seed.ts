import type { Incident } from "../types";

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
