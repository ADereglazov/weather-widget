import { TUnits, TDirection, TPressureUnit } from "@/types";

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
  units: TUnitsAll;
  pressureUnits: TPressureUnits;
  windDirections: TDirections;
}

type TUnitsAll = {
  [key in TUnits]: string;
};

type TPressureUnits = {
  [key in TPressureUnit]: string;
};

type TDirections = {
  [key in TDirection]: string;
};
