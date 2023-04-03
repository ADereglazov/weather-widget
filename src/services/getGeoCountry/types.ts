import { LANGUAGES } from "@/types";

export const COUNTRIES = [...LANGUAGES] as const;
export type TGeoCountry = (typeof COUNTRIES)[number];
