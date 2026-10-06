import { afterEach, describe, expect, it, vi } from "vitest";
import type { Incident } from "../../types";
import { fetchAddress } from "../fetch-address";
import { createIncidentIcon, createPickedIcon } from "../marker-icon";

describe("fetchAddress", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("asks our geocode route for the point", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: "Długa 1" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(await fetchAddress(54.3, 18.6)).toEqual({ address: "Długa 1" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/incident-report/geocode?lat=54.3&lon=18.6",
    );
  });

  it("throws on an error status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 502 }));
    await expect(fetchAddress(54.3, 18.6)).rejects.toThrow("502");
  });
});

describe("incident marker icons", () => {
  const incident = {
    status: "new",
    severity: "high",
    title: "Zalana <jezdnia>",
    address: "Podwale",
  } as Incident;

  it("labels new incidents visibly and escapes the accessible name", () => {
    const html = String(createIncidentIcon(incident, false).options.html);
    expect(html).toContain("incident-marker--new");
    expect(html).toContain("NOWY INCYDENT");
    expect(html).toContain("Zalana &lt;jezdnia&gt;");
  });

  it("has no pulse or label for triaged incidents", () => {
    const html = String(
      createIncidentIcon({ ...incident, status: "verified" }, true).options.html,
    );
    expect(html).not.toContain("NOWY INCYDENT");
    expect(html).toContain("incident-marker--selected");
  });

  it("marks the picked point for screen readers", () => {
    expect(String(createPickedIcon().options.html)).toContain(
      "Wybrane miejsce zgłoszenia",
    );
  });
});
