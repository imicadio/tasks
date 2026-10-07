"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ADDRESS_LOOKUP, EMPTY_DRAFT, STORAGE_KEY } from "./constants";
import { incidentReportSchema } from "./schemas";
import type { IncidentReportState } from "./types";
import { toIncident } from "./utils/draft";
import { fetchAddress } from "./utils/fetch-address";
import { roundCoord } from "./utils/round-coord";

/**
 * Client state for the report form: the in-progress draft (so a refresh
 * doesn't lose a half-filled form), the current step, and every report
 * submitted from this browser. Shared by the form and the map (step 2 picks
 * the location by clicking the map), and persisted to localStorage — the
 * same "global (client)" tier as hydro-monitor's favorites, see
 * docs/decisions/0002-state-architecture.md.
 *
 * `skipHydration`: the server renders with an empty store, so the dashboard
 * rehydrates in an effect after mount to avoid a hydration mismatch.
 */
export const useIncidentReportStore = create<IncidentReportState>()(
  persist(
    (set, get) => ({
      draft: EMPTY_DRAFT,
      step: 0,
      reports: [],
      setField: (key, value) =>
        set((state) => ({ draft: { ...state.draft, [key]: value } })),
      setLocation: (lat, lon) =>
        set((state) => ({ draft: { ...state.draft, lat, lon } })),
      addressLookup: ADDRESS_LOOKUP.Idle,
      pickLocation: async (lat, lon) => {
        // A clicked point is no longer a district's center.
        set((state) => ({
          draft: { ...state.draft, lat: roundCoord(lat), lon: roundCoord(lon), district: "" },
        }));
        await get().lookupAddress();
      },
      lookupAddress: async () => {
        const { lat, lon } = get().draft;
        if (lat === null || lon === null) return;
        set({ addressLookup: ADDRESS_LOOKUP.Loading });
        // Ignore the answer if the point moved while it was in flight.
        const isCurrent = () => get().draft.lat === lat && get().draft.lon === lon;
        try {
          const { address } = await fetchAddress(lat, lon);
          if (!isCurrent()) return;
          if (address === null) {
            set({ addressLookup: ADDRESS_LOOKUP.NotFound });
            return;
          }
          set((state) => ({
            draft: { ...state.draft, address },
            addressLookup: ADDRESS_LOOKUP.Done,
          }));
        } catch {
          if (isCurrent()) set({ addressLookup: ADDRESS_LOOKUP.Error });
        }
      },
      setStep: (step) => set({ step }),
      submit: (now = new Date()) => {
        const input = incidentReportSchema.parse(get().draft);
        const incident = toIncident(input, now);
        set((state) => ({
          reports: [incident, ...state.reports],
          draft: EMPTY_DRAFT,
          step: 0,
          addressLookup: ADDRESS_LOOKUP.Idle,
        }));
        return incident;
      },
    }),
    {
      name: STORAGE_KEY,
      skipHydration: true,
      partialize: ({ draft, step, reports }) => ({ draft, step, reports }),
    },
  ),
);
