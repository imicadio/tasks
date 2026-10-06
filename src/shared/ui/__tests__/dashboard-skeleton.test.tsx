import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { DashboardSkeleton } from "../dashboard-skeleton";

describe("DashboardSkeleton", () => {
  it("announces loading to assistive tech", () => {
    render(<DashboardSkeleton kpis={3} />);
    expect(screen.getByRole("status")).toHaveTextContent("Ładowanie danych…");
  });

  it("renders one placeholder per KPI tile", () => {
    const { container } = render(
      <DashboardSkeleton kpis={4} filters={false} content="none" />,
    );
    // 2 heading lines + 4 tiles
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(6);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <DashboardSkeleton kpis={3} content="map-with-list" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
