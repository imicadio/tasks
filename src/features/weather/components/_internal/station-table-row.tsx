"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { WeatherStation } from "../../types";
import { formatTemp, formatWithUnit } from "../../utils/format";

type Props = { station: WeatherStation };

/** One station: the whole row opens its detail page for pointer users; the
 * name link is the keyboard/screen-reader path. */
export const StationTableRow = ({ station }: Props) => {
  const router = useRouter();
  const href = `/pogoda/${station.id}`;
  const handleRowClick = () => router.push(href);
  // The link navigates on its own — don't let the row push a second time.
  const handleLinkClick = (event: MouseEvent) => event.stopPropagation();

  return (
    <tr
      onClick={handleRowClick}
      className="cursor-pointer border-b border-border/60 hover:bg-accent"
    >
      <td className="py-1.5 text-foreground">
        <Link href={href} className="hover:underline" onClick={handleLinkClick}>
          {station.name}
        </Link>
      </td>
      <td className="py-1.5 text-right tabular-nums">
        {formatTemp(station.temperatureC)}
      </td>
      <td className="py-1.5 text-right tabular-nums">
        {formatWithUnit(station.windSpeedMs, " m/s")}
      </td>
      <td className="py-1.5 text-right tabular-nums">
        {formatWithUnit(station.humidityPct, "%")}
      </td>
      <td className="py-1.5 text-right tabular-nums">
        {formatWithUnit(station.pressureHpa, " hPa")}
      </td>
    </tr>
  );
};
