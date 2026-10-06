import type { District } from "../types";

/** Picking a district drops the pin at its center — the keyboard-operable
 * alternative to clicking the map (WCAG 2.1.1). */
export const DISTRICTS: District[] = [
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
