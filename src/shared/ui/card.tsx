import type { ReactNode } from "react";

export const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-lg border border-chart-baseline/30 bg-chart-surface p-4 ${className}`}
    >
      {children}
    </div>
  );
};
