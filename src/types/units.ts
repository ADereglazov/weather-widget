export const UNITS = ["standard", "metric", "imperial"] as const;

export type TUnits = (typeof UNITS)[number];
