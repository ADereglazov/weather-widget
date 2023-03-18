import { TUnits } from "@/types";

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
  pressure: string;
  humidity: string;
  visibility: string;
  km: string;
  oops: string;
  error: string;
  tryAgain: string;
  somethingWentWrong: string;
  tryReload: string;
  reload: string;
  selectLanguage: string;
  selectUnits: string;
  additionalSettings: string;
  baseSettings: string;
  units: TUnitsAll;
  windDirections: string[];
}

type TUnitsAll = {
  [key in TUnits]: string;
};
