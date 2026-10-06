import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FetchStatus } from "../fetch-status";
import { StatTile } from "../stat-tile";

describe("FetchStatus", () => {
  it("prefers the error over the refreshing note", () => {
    render(<FetchStatus isFetching isError />);
    expect(screen.getByText("Nie udało się pobrać danych.")).toBeInTheDocument();
    expect(screen.queryByText("Odświeżanie…")).toBeNull();
  });

  it("renders nothing when idle", () => {
    const { container } = render(<FetchStatus isFetching={false} isError={false} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("StatTile", () => {
  it("shows the label and value, with an optional decorative dot", () => {
    const { container } = render(<StatTile label="Linie" value={74} dotColor="red" />);
    expect(screen.getByText("Linie")).toBeInTheDocument();
    expect(screen.getByText("74")).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
