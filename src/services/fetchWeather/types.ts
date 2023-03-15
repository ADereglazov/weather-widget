import { ICoordinates } from "@/types/coordinates";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import {
  IWeatherLocation,
  IWeatherLocationTimestamped,
} from "@/types/weatherLocation";

export interface IGetWeatherFromGeoParameters
  extends IGetWeatherCommonParameters {
  coordinates: ICoordinates;
}
export interface IGetWeatherByCityIdParameters
  extends IGetWeatherCommonParameters {
  id: number;
}
interface IGetWeatherCommonParameters {
  lang?: TLanguage;
  units?: TUnits;
  apiUrl: string;
  apiKey: string;
}
export interface IGetWeatherFetchFailed {
  message?: string;
}
export interface IGetWeatherSucceed extends IWeatherLocationTimestamped {
  status: "succeed";
}
export interface IGetWeatherFailed {
  status: "failed";
  message: string;
}

export type TGetWeatherFetchSucceed = IWeatherLocation;
export type TGetWeatherResult = IGetWeatherSucceed | IGetWeatherFailed;
