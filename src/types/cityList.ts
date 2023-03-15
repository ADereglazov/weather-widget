import { ICoordinates } from "@/types/coordinates";
import { IWeatherLocation } from "@/types/weatherLocation";

export interface ICitiListItem {
  id: number;
  name: string;
  state: string;
  country: string;
  coord: ICoordinates;
}

export interface ICityList {
  /** Internal parameter: find cities method */
  message: string;
  /** Internal parameter */
  cod: number;
  /** Count of found cities */
  count: number;
  /** Weather locations list */
  list: IWeatherLocation[];
}
