"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COORD_DECIMALS, EMPTY_DRAFT, STORAGE_KEY } from "./constants";
import { createReference } from "./lib/format";
import { incidentReportSchema } from "./schemas";
import type {
  AddressLookupStatus,
  FormStep,
  GeocodeResult,
  Incident,
  IncidentDraft,
} from "./types";

const round = (value: number) => Number(value.toFixed(COORD_DECIMALS));

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
type IncidentReportState = {
  draft: IncidentDraft;
  step: FormStep;
  reports: Incident[];
  setField: <K extends keyof IncidentDraft>(key: K, value: IncidentDraft[K]) => void;
  setLocation: (lat: number, lon: number) => void;
  /** Not persisted — a lookup in flight doesn't survive a refresh. */
  addressLookup: AddressLookupStatus;
  /** Map click: sets the point and fills the address from it. */
  pickLocation: (lat: number, lon: number) => Promise<void>;
  /** Fills `draft.address` from the current coordinates (overwriting it). */
  lookupAddress: () => Promise<void>;
  setStep: (step: FormStep) => void;
  /** Validates the whole draft, stores it as a `new` incident and resets the
   * form. Throws if the draft is invalid — the form validates per step first. */
  submit: (now?: Date) => Incident;
};

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
      addressLookup: "idle",
      pickLocation: async (lat, lon) => {
        // A clicked point is no longer a district's center.
        set((state) => ({
          draft: { ...state.draft, lat: round(lat), lon: round(lon), district: "" },
        }));
        await get().lookupAddress();
      },
      lookupAddress: async () => {
        const { lat, lon } = get().draft;
        if (lat === null || lon === null) return;
        set({ addressLookup: "loading" });
        // Ignore the answer if the point moved while it was in flight.
        const isCurrent = () => get().draft.lat === lat && get().draft.lon === lon;
        try {
          const response = await fetch(
            `/api/incident-report/geocode?lat=${lat}&lon=${lon}`,
          );
          if (!response.ok) throw new Error(String(response.status));
          const { address } = (await response.json()) as GeocodeResult;
          if (!isCurrent()) return;
          if (address === null) {
            set({ addressLookup: "not-found" });
            return;
          }
          set((state) => ({
            draft: { ...state.draft, address },
            addressLookup: "done",
          }));
        } catch {
          if (isCurrent()) set({ addressLookup: "error" });
        }
      },
      setStep: (step) => set({ step }),
      submit: (now = new Date()) => {
        const input = incidentReportSchema.parse(get().draft);
        const incident: Incident = {
          id: crypto.randomUUID(),
          reference: createReference(now),
          title: input.title,
          description: input.description,
          category: input.category,
          severity: input.severity,
          status: "new",
          lat: input.lat,
          lon: input.lon,
          address: input.address,
          occurredAt: new Date(input.occurredAt).toISOString(),
          reportedAt: now.toISOString(),
          reporter: {
            name: input.reporterName,
            email: input.reporterEmail,
            phone: input.reporterPhone,
          },
        };
        set((state) => ({
          reports: [incident, ...state.reports],
          draft: EMPTY_DRAFT,
          step: 0,
          addressLookup: "idle",
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
