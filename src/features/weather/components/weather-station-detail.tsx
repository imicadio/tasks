import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MISSING_VALUE } from "../constants";
import type { WeatherStation } from "../types";
import {
  formatMeasurementHour,
  formatTemp,
  formatWindDirection,
  formatWithUnit,
} from "../utils/format";
import { StatTile } from "@/shared/ui/stat-tile";

/**
 * Shows every one of the 10 raw fields IMGW's single-station endpoint
 * returns (see src/features/weather/README.md) as its own stat — including
 * `id_stacji`, `data_pomiaru`, and `godzina_pomiaru`, which an earlier
 * version folded into a single "last measured" sentence instead of
 * surfacing individually.
 */
export const WeatherStationDetail = ({ station }: { station: WeatherStation }) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/pogoda"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Wszystkie stacje
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          {station.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Źródło: dane publiczne IMGW-PIB
          (danepubliczne.imgw.pl/api/data/synop/id/{station.id}).
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile size="md" label="ID stacji" value={station.id} />
        <StatTile
          size="md"
          label="Data pomiaru"
          value={station.measurementDate ?? MISSING_VALUE}
        />
        <StatTile
          size="md"
          label="Godzina pomiaru"
          value={formatMeasurementHour(station.measurementHour)}
        />
        <StatTile size="md" label="Temperatura" value={formatTemp(station.temperatureC)} />
        <StatTile
          size="md"
          label="Prędkość wiatru"
          value={formatWithUnit(station.windSpeedMs, " m/s")}
        />
        <StatTile
          size="md"
          label="Kierunek wiatru"
          value={formatWindDirection(station.windDirectionDeg)}
        />
        <StatTile
          size="md"
          label="Wilgotność względna"
          value={formatWithUnit(station.humidityPct, "%")}
        />
        <StatTile
          size="md"
          label="Suma opadu"
          value={formatWithUnit(station.precipitationMm, " mm")}
        />
        <StatTile
          size="md"
          label="Ciśnienie"
          value={formatWithUnit(station.pressureHpa, " hPa")}
        />
      </div>
    </div>
  );
};
