import { TUnits } from "@/types";

export interface IDictionary {
  settings: string;
  closeSettings: string;
  addLocation: string;
  inputPlaceholder: string;
  clearInput: string;
  addNewLocation: string;
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
  noDataMessage: string;
  somethingWentWrong: string;
  tryReload: string;
  reload: string;
  selectLanguage: string;
  selectUnits: string;
  additionalSettings: string;
  baseSettings: string;
  tooltipText: string;
  units: TUnitsAll;
}

type TUnitsAll = {
  [key in TUnits]: string;
};
