export const PRESSURE_UNITS = ["hPa", "mmHg"] as const;

export type TPressureUnit = (typeof PRESSURE_UNITS)[number];
