import {
  ICoordinates,
  TLanguage,
  TUnits,
  IWeatherLocation,
  IWeatherLocationsList,
  IWeatherLocationTimestamped,
  IWeatherLocationsListTimestamped,
} from "@/types";

export interface IGetWeatherFromGeoParameters
  extends IGetWeatherCommonParameters {
  coordinates: ICoordinates;
}
export interface IGetWeatherByCityNameParameters
  extends IGetWeatherCommonParameters {
  city: string;
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
export interface IGetWeatherFetchByNameSucceed
  extends IWeatherLocationsListTimestamped {
  status: "succeed";
}

export type TGetWeatherFetchSucceed = IWeatherLocation;
export type TGetWeatherResult = IGetWeatherSucceed | IGetWeatherFailed;

export type TGetWeatherFetchByNameSucceed = IWeatherLocationsList;
export type TGetWeatherByNameResult =
  | IGetWeatherFetchByNameSucceed
  | IGetWeatherFailed;
