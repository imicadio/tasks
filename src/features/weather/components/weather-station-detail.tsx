import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { degreesToCompass } from "@/shared/utils/compass";
import type { WeatherStation } from "../types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </Card>
  );
}

const DASH = "—";

/**
 * Shows every one of the 10 raw fields IMGW's single-station endpoint
 * returns (see src/features/weather/README.md) as its own stat — including
 * `id_stacji`, `data_pomiaru`, and `godzina_pomiaru`, which an earlier
 * version folded into a single "last measured" sentence instead of
 * surfacing individually.
 */
export function WeatherStationDetail({ station }: { station: WeatherStation }) {
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
        <Stat label="ID stacji" value={station.id} />
        <Stat label="Data pomiaru" value={station.measurementDate ?? DASH} />
        <Stat
          label="Godzina pomiaru"
          value={
            station.measurementHour === null
              ? DASH
              : `${station.measurementHour}:00`
          }
        />
        <Stat
          label="Temperatura"
          value={
            station.temperatureC === null
              ? DASH
              : `${station.temperatureC.toFixed(1)} °C`
          }
        />
        <Stat
          label="Prędkość wiatru"
          value={
            station.windSpeedMs === null ? DASH : `${station.windSpeedMs} m/s`
          }
        />
        <Stat
          label="Kierunek wiatru"
          value={
            station.windDirectionDeg === null
              ? DASH
              : `${station.windDirectionDeg}° (${degreesToCompass(station.windDirectionDeg)})`
          }
        />
        <Stat
          label="Wilgotność względna"
          value={
            station.humidityPct === null ? DASH : `${station.humidityPct}%`
          }
        />
        <Stat
          label="Suma opadu"
          value={
            station.precipitationMm === null
              ? DASH
              : `${station.precipitationMm} mm`
          }
        />
        <Stat
          label="Ciśnienie"
          value={
            station.pressureHpa === null ? DASH : `${station.pressureHpa} hPa`
          }
        />
      </div>
    </div>
  );
}
