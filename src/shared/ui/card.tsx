import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: Props) => {
  return (
    <div
      className={`rounded-lg border border-chart-baseline/30 bg-chart-surface p-4 ${className}`}
    >
      {children}
    </div>
  );
};
