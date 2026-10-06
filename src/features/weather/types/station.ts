export type WeatherStation = {
  id: string;
  name: string;
  /** Raw `data_pomiaru` — kept separate from `measurementHour` rather than
   * pre-joined, so the detail view can show every field IMGW returns on
   * its own, as received. */
  measurementDate: string | null;
  /** Raw `godzina_pomiaru`. IMGW returns this as a string on the
   * single-station endpoint and a string-or-number on the list endpoint —
   * kept as a string here since it's an hour label, not a quantity. */
  measurementHour: string | null;
  temperatureC: number | null;
  windSpeedMs: number | null;
  windDirectionDeg: number | null;
  humidityPct: number | null;
  precipitationMm: number | null;
  pressureHpa: number | null;
};

/** A station known to have a temperature reading. */
export type WeatherStationWithTemp = WeatherStation & { temperatureC: number };
