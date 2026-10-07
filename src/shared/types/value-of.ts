/** Union of an object's values — derives a type from an `as const` value
 * map: `type VehicleType = ValueOf<typeof VEHICLE_TYPE>`. */
export type ValueOf<T> = T[keyof T];
