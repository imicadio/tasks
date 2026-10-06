import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EMPTY_DRAFT, STORAGE_KEY } from "../constants";
import { useIncidentReportStore } from "../store";

const FILLED = {
  category: "infrastructure",
  severity: "medium",
  title: "Brak oświetlenia",
  description: "Od tygodnia nie działa żadna latarnia na całej ulicy.",
  district: "oliwa",
  lat: 54.4106,
  lon: 18.5598,
  address: "ul. Opata Rybińskiego",
  occurredAt: "2026-10-01T20:00",
  reporterName: "Jan Nowak",
  reporterEmail: "jan@example.com",
  reporterPhone: "600100200",
  consent: true,
} as const;

describe("useIncidentReportStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useIncidentReportStore.setState({
      draft: EMPTY_DRAFT,
      step: 0,
      reports: [],
      addressLookup: "idle",
    });
  });

  it("persists the draft and step to localStorage as they change", () => {
    useIncidentReportStore.getState().setField("title", "Szkic");
    useIncidentReportStore.getState().setStep(1);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.state.draft.title).toBe("Szkic");
    expect(saved.state.step).toBe(1);
  });

  it("submit stores a `new` incident, resets the form and persists the report", () => {
    useIncidentReportStore.setState({ draft: { ...FILLED }, step: 2 });
    const incident = useIncidentReportStore
      .getState()
      .submit(new Date("2026-10-05T10:00:00Z"));

    expect(incident).toMatchObject({
      status: "new",
      title: "Brak oświetlenia",
      lat: 54.4106,
      reporter: { name: "Jan Nowak", email: "jan@example.com", phone: "600100200" },
    });
    expect(incident.reference).toMatch(/^ZGL-20261005-\d{4}$/);

    const state = useIncidentReportStore.getState();
    expect(state.reports).toEqual([incident]);
    expect(state.draft).toEqual(EMPTY_DRAFT);
    expect(state.step).toBe(0);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).state.reports).toHaveLength(1);
  });

  afterEach(() => vi.restoreAllMocks());

  it("pickLocation sets rounded coordinates and fills the address from the geocoder", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ address: "Długa 45, Śródmieście" }),
    );
    useIncidentReportStore.setState({
      draft: { ...EMPTY_DRAFT, district: "oliwa", address: "stary adres" },
    });
    const pending = useIncidentReportStore.getState().pickLocation(54.34849721234, 18.6526923);
    expect(useIncidentReportStore.getState().addressLookup).toBe("loading");
    await pending;

    const { draft, addressLookup } = useIncidentReportStore.getState();
    expect(draft).toMatchObject({
      lat: 54.348497,
      lon: 18.652692,
      district: "",
      address: "Długa 45, Śródmieście",
    });
    expect(addressLookup).toBe("done");
  });

  it("keeps the typed address when the geocoder finds nothing or fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json({ address: null }));
    useIncidentReportStore.setState({ draft: { ...EMPTY_DRAFT, address: "przy molo" } });
    await useIncidentReportStore.getState().pickLocation(54.41, 18.6);
    expect(useIncidentReportStore.getState()).toMatchObject({
      addressLookup: "not-found",
      draft: { address: "przy molo" },
    });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(null, { status: 502 }));
    await useIncidentReportStore.getState().pickLocation(54.42, 18.6);
    expect(useIncidentReportStore.getState().addressLookup).toBe("error");
  });

  it("ignores a lookup answer for a point that has since moved", async () => {
    let resolveFirst!: (response: Response) => void;
    vi.spyOn(globalThis, "fetch")
      .mockReturnValueOnce(new Promise((resolve) => (resolveFirst = resolve)))
      .mockResolvedValueOnce(Response.json({ address: "Drugi punkt" }));
    const first = useIncidentReportStore.getState().pickLocation(54.35, 18.65);
    await useIncidentReportStore.getState().pickLocation(54.36, 18.66);
    resolveFirst(Response.json({ address: "Pierwszy punkt" }));
    await first;
    expect(useIncidentReportStore.getState().draft.address).toBe("Drugi punkt");
  });

  it("submit refuses an invalid draft", () => {
    expect(() => useIncidentReportStore.getState().submit()).toThrow();
    expect(useIncidentReportStore.getState().reports).toEqual([]);
  });
});
