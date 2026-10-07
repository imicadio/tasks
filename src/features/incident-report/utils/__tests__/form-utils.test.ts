import { describe, expect, it } from "vitest";
import { EMPTY_DRAFT } from "../../constants";
import type { Incident } from "../../types";
import { draftPoint, toIncident } from "../draft";
import { describedBy, errorId, hintId } from "../field-ids";
import { mapFocusTarget } from "../map-focus";
import { parseCoordinate } from "../parse-coordinate";
import { roundCoord } from "../round-coord";

describe("parseCoordinate", () => {
  it("accepts a decimal point or a Polish decimal comma", () => {
    expect(parseCoordinate("54.3812")).toBe(54.3812);
    expect(parseCoordinate(" 54,3812 ")).toBe(54.3812);
  });

  it("is null for empty or non-numeric text", () => {
    expect(parseCoordinate("")).toBeNull();
    expect(parseCoordinate("abc")).toBeNull();
  });
});

describe("roundCoord", () => {
  it("rounds to six decimals", () => {
    expect(roundCoord(54.123456789)).toBe(54.123457);
  });
});

describe("field ids", () => {
  it("joins the hint and error ids that apply", () => {
    expect(errorId("title")).toBe("title-error");
    expect(hintId("title")).toBe("title-hint");
    expect(describedBy("title", true, "Wymagane")).toBe("title-hint title-error");
    expect(describedBy("title", false, undefined)).toBeUndefined();
  });
});

describe("draftPoint", () => {
  it("is null until both coordinates are set", () => {
    expect(draftPoint(EMPTY_DRAFT)).toBeNull();
    expect(draftPoint({ ...EMPTY_DRAFT, lat: 54.3 })).toBeNull();
    expect(draftPoint({ ...EMPTY_DRAFT, lat: 54.3, lon: 18.6 })).toEqual([54.3, 18.6]);
  });
});

describe("mapFocusTarget", () => {
  const selected = { lat: 54.1, lon: 18.1 } as Incident;

  it("prefers the selected incident", () => {
    expect(mapFocusTarget(selected, [54.2, 18.2], true)).toEqual([54.1, 18.1]);
  });

  it("uses the picked point only while picking", () => {
    expect(mapFocusTarget(undefined, [54.2, 18.2], true)).toEqual([54.2, 18.2]);
    expect(mapFocusTarget(undefined, [54.2, 18.2], false)).toBeNull();
  });
});

describe("toIncident", () => {
  it("builds a new incident with a reference and ISO timestamps", () => {
    const now = new Date("2026-10-05T10:00:00Z");
    const incident = toIncident(
      {
        category: "road",
        severity: "high",
        title: "Tytuł",
        description: "Opis zdarzenia na drodze",
        lat: 54.3,
        lon: 18.6,
        address: "Długa 1",
        occurredAt: "2026-10-05T09:30",
        reporterName: "Jan Kowalski",
        reporterEmail: "jan@example.com",
        reporterPhone: "",
        consent: true,
      } as Parameters<typeof toIncident>[0],
      now,
      "id-1",
    );

    expect(incident).toMatchObject({
      id: "id-1",
      status: "new",
      reportedAt: now.toISOString(),
      reporter: { name: "Jan Kowalski", email: "jan@example.com", phone: "" },
    });
    expect(incident.reference).toMatch(/^ZGL-20261005-\d{4}$/);
  });
});

describe("joinIds", () => {
  it("joins the non-empty ids, or returns undefined", async () => {
    const { joinIds } = await import("../field-ids");
    expect(joinIds("a-hint", false, undefined, "status")).toBe("a-hint status");
    expect(joinIds(false, undefined)).toBeUndefined();
  });
});

describe("firstInvalidFieldId", () => {
  it("returns the first invalid field in on-screen order", async () => {
    const { firstInvalidFieldId } = await import("../first-invalid-field");
    expect(firstInvalidFieldId(0, { title: "x", category: "y" })).toBe("category");
  });

  it("maps the coordinates fieldset to its first input, and is null when valid", async () => {
    const { firstInvalidFieldId } = await import("../first-invalid-field");
    expect(firstInvalidFieldId(1, { location: "x" })).toBe("lat");
    expect(firstInvalidFieldId(2, {})).toBeNull();
  });
});

describe("markerZIndex", () => {
  it("stacks new above selected above the rest", async () => {
    const { markerZIndex } = await import("../marker-z-index");
    expect(markerZIndex({ status: "new" }, false)).toBe(1000);
    expect(markerZIndex({ status: "verified" }, true)).toBe(500);
    expect(markerZIndex({ status: "resolved" }, false)).toBe(0);
  });
});

describe("formatIncidentMeta", () => {
  it("joins category and lower-cased severity", async () => {
    const { formatIncidentMeta } = await import("../format");
    expect(formatIncidentMeta({ category: "road", severity: "high" })).toBe(
      "Zagrożenie drogowe · zagrożenie wysoki",
    );
  });
});

describe("draftSummary", () => {
  it("shows dashes for an empty draft", async () => {
    const { draftSummary } = await import("../draft-summary");
    expect(draftSummary(EMPTY_DRAFT)).toEqual({
      category: "—",
      severity: "—",
      title: "—",
      place: "—",
      when: "—",
    });
  });

  it("labels filled fields and appends the district to the place", async () => {
    const { draftSummary } = await import("../draft-summary");
    const summary = draftSummary({
      ...EMPTY_DRAFT,
      category: "road",
      severity: "low",
      address: "Długa 1",
      district: "srodmiescie",
    });
    expect(summary.category).toBe("Zagrożenie drogowe");
    expect(summary.severity).toBe("Niski");
    expect(summary.place).toBe("Długa 1, Śródmieście");
  });
});

describe("isCoordinateField", () => {
  it("recognizes lat and lon only", async () => {
    const { isCoordinateField } = await import("../is-coordinate-field");
    expect(isCoordinateField("lat")).toBe(true);
    expect(isCoordinateField("lon")).toBe(true);
    expect(isCoordinateField("title")).toBe(false);
  });
});
