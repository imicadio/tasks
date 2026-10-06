import type { ReactNode } from "react";

export type NavItem = {
  href: string;
  label: string;
  /** A pre-rendered icon element (e.g. `<CarFront className="size-4" />`) —
   * not a component reference, since this crosses a server→client prop
   * boundary and raw function/component references aren't serializable
   * there. */
  icon: ReactNode;
};
