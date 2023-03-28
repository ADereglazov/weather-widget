import { TLanguage, TPressureUnit, TUnits, TUpdatePeriod } from "@/types";

export interface ISettings {
  lang: TLanguage;
  updatePeriod: TUpdatePeriod;
  units: TUnits;
  pressureUnit: TPressureUnit;
}
