import { ICoordinates, IWeatherLocation } from "@/types";

export interface ICitiListItem {
  id: number;
  name: string;
  state: string;
  country: string;
  coord: ICoordinates;
}
export interface IWeatherLocationsListTimestamped
  extends IWeatherLocationsList {
  /** Time of data update (app internal parameter), unix, UTC */
  lastUpdated: number;
}
export interface IWeatherLocationsList {
  /** Internal parameter: find cities method */
  message: string;
  /** Internal parameter */
  cod: number;
  /** Count of found cities */
  count: number;
  /** Weather locations list */
  list: IWeatherLocation[];
}
