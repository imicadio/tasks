import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EMPTY_DRAFT } from "../../constants";
import { useIncidentReportStore } from "../../store";
import { IncidentForm } from "../incident-form";

const AXE_OPTIONS = { rules: { "color-contrast": { enabled: false } } };

function type(label: RegExp | string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function next() {
  fireEvent.click(screen.getByRole("button", { name: /dalej/i }));
}

describe("IncidentForm", () => {
  beforeEach(() => {
    localStorage.clear();
    useIncidentReportStore.setState({ draft: EMPTY_DRAFT, step: 0, reports: [] });
  });

  it("blocks the first step until it is valid and stays accessible with errors shown", async () => {
    const { container } = render(<IncidentForm onSubmitted={() => {}} />);
    expect(screen.getByRole("heading", { name: /krok 1 z 3/i })).toBeInTheDocument();

    next();

    expect(await screen.findByText("Wybierz kategorię incydentu.")).toBeInTheDocument();
    expect(screen.getByLabelText("Tytuł zgłoszenia")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("heading", { name: /krok 1 z 3/i })).toBeInTheDocument();
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
  });

  it("walks through all three steps and submits", async () => {
    const onSubmitted = vi.fn();
    const { container } = render(<IncidentForm onSubmitted={onSubmitted} />);

    fireEvent.click(screen.getByLabelText(/zagrożenie drogowe/i));
    fireEvent.click(screen.getByLabelText("Wysoki"));
    type("Tytuł zgłoszenia", "Zapadnięty chodnik");
    type(/^opis/i, "Chodnik zapadł się na długości dwóch metrów przy przystanku.");
    next();

    expect(screen.getByRole("heading", { name: /krok 2 z 3: lokalizacja/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/dzielnica/i), { target: { value: "zaspa" } });
    expect(screen.getByLabelText("Szerokość geograficzna")).toHaveValue("54.3963");
    expect(screen.getByLabelText("Długość geograficzna")).toHaveValue("18.6094");
    type(/adres lub opis miejsca/i, "ul. Pilotów 10");
    type(/data i godzina/i, "2026-10-01T08:30");
    next();

    expect(screen.getByRole("heading", { name: /krok 3 z 3/i })).toBeInTheDocument();
    expect(screen.getByText("Zapadnięty chodnik")).toBeInTheDocument(); // summary
    type(/imię i nazwisko/i, "Anna Kowalska");
    type(/e-mail/i, "anna@example.com");
    fireEvent.click(screen.getByRole("checkbox"));
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();

    fireEvent.click(screen.getByRole("button", { name: /wyślij zgłoszenie/i }));
    expect(screen.getByRole("button", { name: /wysyłanie/i })).toBeDisabled();

    expect(
      await screen.findByRole("heading", { name: /wysłane pomyślnie/i }, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(screen.getByText("NOWY INCYDENT")).toBeInTheDocument();
    expect(onSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({ status: "new", title: "Zapadnięty chodnik" }),
    );
    expect(useIncidentReportStore.getState().reports).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: /zgłoś kolejny/i }));
    expect(screen.getByRole("heading", { name: /krok 1 z 3/i })).toBeInTheDocument();
  });

  it("accepts manually typed coordinates (with a decimal comma) and fills the address on request", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(Response.json({ address: "Długa 45, Śródmieście" }));
    useIncidentReportStore.setState({ draft: { ...EMPTY_DRAFT }, step: 1 });
    const { container } = render(<IncidentForm onSubmitted={() => {}} />);

    const lookup = screen.getByRole("button", { name: /uzupełnij adres/i });
    expect(lookup).toBeDisabled();

    type("Szerokość geograficzna", "54,3485");
    type("Długość geograficzna", "18.6526");
    expect(useIncidentReportStore.getState().draft).toMatchObject({ lat: 54.3485, lon: 18.6526 });
    expect(screen.getByLabelText("Szerokość geograficzna")).toHaveValue("54,3485");

    fireEvent.click(lookup);
    expect(await screen.findByDisplayValue("Długa 45, Śródmieście")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/incident-report/geocode?lat=54.3485&lon=18.6526");
    expect(screen.getByRole("status")).toHaveTextContent(/uzupełniony na podstawie mapy/i);
    expect(await axe(container, AXE_OPTIONS)).toHaveNoViolations();
    fetchMock.mockRestore();
  });

  it("reports missing coordinates and focuses the latitude field", async () => {
    useIncidentReportStore.setState({ draft: { ...EMPTY_DRAFT }, step: 1 });
    render(<IncidentForm onSubmitted={() => {}} />);
    next();
    expect(await screen.findByText(/wskaż miejsce na mapie/i)).toBeInTheDocument();
    await vi.waitFor(() =>
      expect(screen.getByLabelText("Szerokość geograficzna")).toHaveFocus(),
    );
  });

  it("goes back without losing entered data", () => {
    useIncidentReportStore.setState({
      draft: { ...EMPTY_DRAFT, title: "Zapisany szkic" },
      step: 1,
    });
    render(<IncidentForm onSubmitted={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /wstecz/i }));
    expect(screen.getByLabelText("Tytuł zgłoszenia")).toHaveValue("Zapisany szkic");
  });
});
