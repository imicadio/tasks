import {
  Bus,
  CarFront,
  ClipboardPen,
  CloudSun,
  SquareParking,
  Waves,
} from "lucide-react";
import type { NavItem } from "@/shared/types/nav";

/** Sidebar links, in display order. */
export const NAV_ITEMS: NavItem[] = [
  {
    href: "/road-accidents",
    label: "Wypadki drogowe",
    icon: <CarFront className="size-4" />,
  },
  {
    href: "/hydrologia",
    label: "Hydrologia",
    icon: <Waves className="size-4" />,
  },
  {
    href: "/pogoda",
    label: "Pogoda",
    icon: <CloudSun className="size-4" />,
  },
  {
    href: "/transport",
    label: "Transport publiczny",
    icon: <Bus className="size-4" />,
  },
  {
    href: "/parkingi",
    label: "Parkingi",
    icon: <SquareParking className="size-4" />,
  },
  {
    href: "/formularz",
    label: "Formularz",
    icon: <ClipboardPen className="size-4" />,
  },
];

export const REPO_URL = "https://github.com/imicadio/tasks";
