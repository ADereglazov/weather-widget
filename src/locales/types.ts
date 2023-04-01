import { TUnits, TDirection, TPressureUnit, TLanguage } from "@/types";

export interface IDictionary {
  settings: string;
  closeSettings: string;
  addLocation: string;
  inputPlaceholder: string;
  clearInput: string;
  deleteItem: string;
  feelsLike: string;
  cloudCover: string;
  windSpeed: string;
  windSpeedImperial: string;
  humidity: string;
  visibility: string;
  updated: string;
  km: string;
  meter: string;
  oops: string;
  error: string;
  tryAgain: string;
  somethingWentWrong: string;
  tryReload: string;
  reload: string;
  selectLanguage: string;
  selectUnits: string;
  selectPressure: string;
  additionalSettings: string;
  baseSettings: string;
  languages: TLanguages;
  units: TUnitsAll;
  pressureUnits: TPressureUnits;
  windDirections: TDirections;
  updatePeriodTitle: string;
  oneHour: string;
  twoHours: string;
  fiveHours: string;
}

type TLanguages = {
  [key in TLanguage]: string;
};

type TUnitsAll = {
  [key in TUnits]: string;
};

type TPressureUnits = {
  [key in TPressureUnit]: string;
};

type TDirections = {
  [key in TDirection]: string;
};
