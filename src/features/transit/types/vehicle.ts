declare const vehicleIdBrand: unique symbol;
export type VehicleId = number & { readonly [vehicleIdBrand]: true };

/** Bearing in degrees, snapped by the source system to 8 compass points
 * (0/45/90/.../315) — see README.md. */
export type Direction = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315;

/** From ZTM Gdańsk's routes feed (routeType: "BUS"/"TRAM"/anything else),
 * not guessed from the route number — see server/queries.ts. */
export type VehicleType = "bus" | "tram" | "other";

export type Vehicle = {
  id: VehicleId;
  routeId: number;
  routeShortName: string;
  vehicleType: VehicleType;
  headsign: string;
  vehicleCode: string;
  lat: number;
  lon: number;
  speedKmh: number;
  direction: Direction;
  delaySeconds: number;
  generatedAt: string;
};

export type VehiclesSnapshot = {
  lastUpdate: string;
  vehicles: Vehicle[];
};
