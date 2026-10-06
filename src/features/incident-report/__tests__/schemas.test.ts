import { describe, expect, it } from "vitest";
import { EMPTY_DRAFT } from "../constants";
import { incidentReportSchema, validateStep } from "../schemas";
import type { IncidentDraft } from "../types";

const VALID: IncidentDraft = {
  category: "road",
  severity: "high",
  title: "Dziura w jezdni",
  description: "Głęboka dziura na prawym pasie, samochody gwałtownie hamują.",
  district: "wrzeszcz",
  lat: 54.3792,
  lon: 18.6068,
  address: "al. Grunwaldzka 100",
  occurredAt: "2026-10-01T08:30",
  reporterName: "Anna Kowalska",
  reporterEmail: "anna@example.com",
  reporterPhone: "",
  consent: true,
};

describe("validateStep", () => {
  it("passes every step for a complete draft", () => {
    expect(validateStep(0, VALID)).toEqual({});
    expect(validateStep(1, VALID)).toEqual({});
    expect(validateStep(2, VALID)).toEqual({});
    expect(incidentReportSchema.safeParse(VALID).success).toBe(true);
  });

  it("reports every missing field of step 1 in Polish", () => {
    expect(validateStep(0, EMPTY_DRAFT)).toEqual({
      category: "Wybierz kategorię incydentu.",
      severity: "Określ poziom zagrożenia.",
      title: "Tytuł musi mieć co najmniej 5 znaków.",
      description: "Opis musi mieć co najmniej 20 znaków.",
    });
  });

  it("only validates the fields of the requested step", () => {
    expect(validateStep(1, { ...EMPTY_DRAFT, ...pick(VALID, "lat", "lon", "address", "occurredAt") })).toEqual({});
  });

  it("reports a missing or out-of-town point under `location`", () => {
    expect(validateStep(1, { ...VALID, lat: null, lon: null }).location).toBe(
      "Wskaż miejsce na mapie lub wybierz dzielnicę.",
    );
    expect(validateStep(1, { ...VALID, lat: 52.23, lon: 21.01 }).location).toBe(
      "Wskazany punkt leży poza Gdańskiem.",
    );
  });

  it("rejects a future date", () => {
    expect(validateStep(1, { ...VALID, occurredAt: "2999-01-01T00:00" }).occurredAt).toBe(
      "Data zdarzenia nie może być z przyszłości.",
    );
  });

  it("validates e-mail, optional phone and consent", () => {
    const errors = validateStep(2, {
      ...VALID,
      reporterEmail: "nie-mail",
      reporterPhone: "123",
      consent: false,
    });
    expect(Object.keys(errors).sort()).toEqual(["consent", "reporterEmail", "reporterPhone"]);
    expect(validateStep(2, { ...VALID, reporterPhone: "+48 600 100 200" })).toEqual({});
  });
});

function pick<K extends keyof IncidentDraft>(draft: IncidentDraft, ...keys: K[]) {
  return Object.fromEntries(keys.map((key) => [key, draft[key]])) as Pick<IncidentDraft, K>;
}

describe("geocodeQuerySchema", () => {
  it("coerces query-string coordinates inside Gdańsk and rejects the rest", async () => {
    const { geocodeQuerySchema } = await import("../schemas");
    expect(geocodeQuerySchema.parse({ lat: "54.35", lon: "18.65" })).toEqual({ lat: 54.35, lon: 18.65 });
    expect(geocodeQuerySchema.safeParse({ lat: "52.23", lon: "21.01" }).success).toBe(false);
    expect(geocodeQuerySchema.safeParse({ lat: "x", lon: "18.65" }).success).toBe(false);
  });
});
